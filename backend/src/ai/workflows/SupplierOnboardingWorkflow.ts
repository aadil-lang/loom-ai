import { AgentGraphBuilder } from '../graphs/AgentGraphBuilder';
import { SupplierOnboardingState, OnboardingStage, ExtractedDataSchema } from '../schemas/OnboardingSchemas';
import { LlmService } from '../services/llmService';
import { OnboardingSystemPrompt, ExtractorSystemPrompt } from '../prompts/onboardingPrompts';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AuthTools } from '../tools/AuthTools';

// The graph defines the state channels (how to merge updates)
const onboardingStateChannels = {
  sessionId: null, // Just replace on update
  language: null,
  progress: null,
  missingFields: null,
  collectedData: {
    // Merge object properties instead of full replacement
    reducer: (a: any, b: any) => ({ ...a, ...b }),
    default: () => ({})
  },
  currentStage: null,
  messages: {
    // Append new messages to the array
    reducer: (a: any[], b: any[]) => a.concat(b),
    default: () => []
  }
};

export class SupplierOnboardingWorkflow {
  private llmService = LlmService.getInstance();
  private authTools = new AuthTools();

  public build() {
    const builder = new AgentGraphBuilder<SupplierOnboardingState>(onboardingStateChannels);

    builder
      .addNode('analyze_input', this.analyzeInputNode.bind(this))
      .addNode('validate_data', this.validateDataNode.bind(this))
      .addNode('chat_response', this.chatResponseNode.bind(this))
      .addNode('check_email', this.checkEmailNode.bind(this));

    // Define edges
    builder.setEntryPoint('analyze_input');
    
    builder.addConditionalEdges(
      'analyze_input',
      (state) => {
        // If they provided an email, check it
        if (state.collectedData?.email && !state.context?.emailChecked) {
          return 'check_email';
        }
        return 'validate_data';
      }
    );

    builder.addEdge('check_email', 'validate_data');
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

  private async checkEmailNode(state: SupplierOnboardingState): Promise<Partial<SupplierOnboardingState>> {
    const tool = this.authTools.getCheckEmailTool();
    const result = await tool.invoke({ email: state.collectedData.email! });
    const parsed = JSON.parse(result);
    
    // If it exists, remove it from collectedData so we ask again
    if (parsed.exists) {
      return {
        context: { ...state.context, emailChecked: true, emailError: 'Email already exists.' },
        collectedData: { ...state.collectedData, email: undefined } as any
      };
    }
    
    return {
      context: { ...state.context, emailChecked: true, emailError: null }
    };
  }

  private async validateDataNode(state: SupplierOnboardingState): Promise<Partial<SupplierOnboardingState>> {
    const requiredFields = ['companyName', 'contactName', 'email', 'businessType', 'country'];
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

    const emailError = state.context?.emailError ? `The email provided was already taken. Ask for a different one.` : '';

    const response = await model.invoke([
      new SystemMessage(systemPrompt + emailError),
      ...state.messages // pass history
    ]);

    return {
      messages: [response]
    };
  }
}
