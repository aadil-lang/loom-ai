import { AgentGraphBuilder } from '../graphs/AgentGraphBuilder';
import { SupplierOnboardingState, OnboardingStage, ExtractedDataSchema } from '../schemas/OnboardingSchemas';
import { LlmService } from '../services/llmService';
import { OnboardingSystemPrompt, ExtractorSystemPrompt } from '../prompts/onboardingPrompts';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { RAGTools } from '../tools/RAGTools';

// The graph defines the state channels (how to merge updates)
const onboardingStateChannels = {
  sessionId: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined },
  language: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined },
  progress: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined },
  missingFields: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined },
  collectedData: {
    // Merge object properties instead of full replacement
    reducer: (a: any, b: any) => ({ ...a, ...b }),
    default: () => ({})
  },
  currentStage: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined },
  messages: {
    // Append new messages to the array
    reducer: (a: any[], b: any[]) => a.concat(b),
    default: () => []
  }
};

export class SupplierOnboardingWorkflow {
  private llmService = LlmService.getInstance();
  private ragTools = new RAGTools();

  public build() {
    const builder = new AgentGraphBuilder<SupplierOnboardingState>(onboardingStateChannels);

    builder
      .addNode('analyze_input', this.analyzeInputNode.bind(this))
      .addNode('validate_data', this.validateDataNode.bind(this))
      .addNode('chat_response', this.chatResponseNode.bind(this));

    // Define edges
    builder.setEntryPoint('analyze_input');
    builder.addEdge('analyze_input', 'validate_data');
    builder.addEdge('validate_data', 'chat_response');
    builder.setFinishPoint('chat_response');

    return builder.compile();
  }

  private async analyzeInputNode(state: SupplierOnboardingState): Promise<Partial<SupplierOnboardingState>> {
    const model = this.llmService.getProvider().getChatModel();
    const extractorModel = model.withStructuredOutput(ExtractedDataSchema);

    // Get the latest human message
    const lastMessage = state.messages[state.messages.length - 1];
    if (!(lastMessage instanceof HumanMessage)) return {};

    const systemPrompt = await ExtractorSystemPrompt.format({
      collectedData: JSON.stringify(state.collectedData || {})
    });

    try {
      const result = await extractorModel.invoke([
        new SystemMessage(systemPrompt),
        lastMessage
      ]);

      return {
        collectedData: result.extractedData,
        language: result.detectedLanguage || state.language || 'en'
      };
    } catch (error) {
      console.error('Extraction error', error);
      return {};
    }
  }

  private async validateDataNode(state: SupplierOnboardingState): Promise<Partial<SupplierOnboardingState>> {
    const requiredFields = ['companyDescription', 'businessType', 'capabilities', 'operatingRegions'];
    const missing: string[] = [];
    
    for (const field of requiredFields) {
      if (!(state.collectedData as any)[field]) {
        missing.push(field);
      }
    }

    const progress = Math.round(((requiredFields.length - missing.length) / requiredFields.length) * 100);
    const currentStage = missing.length === 0 ? OnboardingStage.CONFIRMATION : OnboardingStage.COLLECTION;

    return {
      missingFields: missing,
      progress,
      currentStage
    };
  }

  private async chatResponseNode(state: SupplierOnboardingState): Promise<Partial<SupplierOnboardingState>> {
    const model = this.llmService.getProvider().getChatModel();
    
    const systemPrompt = await OnboardingSystemPrompt.format({
      language: state.language || 'English',
      collectedData: JSON.stringify(state.collectedData || {}),
      missingFields: state.missingFields?.join(', ') || 'None'
    });

    // If the user asked a question, we can retrieve knowledge.
    // For simplicity, we can do a naive quick lookup of the last human message.
    let knowledgeContext = '';
    const lastMessage = state.messages[state.messages.length - 1]?.content;
    if (typeof lastMessage === 'string' && lastMessage.endsWith('?')) {
      const tool = this.ragTools.getRetrieveTextileKnowledgeTool();
      knowledgeContext = await tool.invoke({ topic: lastMessage });
      knowledgeContext = `\n\nPlatform Knowledge:\n${knowledgeContext}\nAnswer the user's question using this knowledge if relevant.`;
    }

    const response = await model.invoke([
      new SystemMessage(systemPrompt + knowledgeContext),
      ...state.messages // pass history
    ]);

    return {
      messages: [response]
    };
  }
}
