import { AgentGraphBuilder } from '../graphs/AgentGraphBuilder';
import { ProcurementState, ExtractedRequirementsSchema } from '../schemas/ProcurementSchemas';
import { LlmService } from '../services/llmService';
import { ProcurementExtractionPrompt, ProcurementClarificationPrompt, ProcurementRecommendationPrompt } from '../prompts/procurementPrompts';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ProductTools } from '../tools/ProductTools';
import { RAGTools } from '../tools/RAGTools';

const procurementStateChannels = {
  sessionId: null,
  language: null,
  requirements: {
    reducer: (a: any, b: any) => ({ ...a, ...b }),
    default: () => ({})
  },
  foundProducts: null,
  foundSuppliers: null,
  recommendationSummary: null,
  retrievedKnowledge: {
    reducer: (a: any, b: any) => (b ? b : a),
    default: () => null
  },
  messages: {
    reducer: (a: any[], b: any[]) => a.concat(b),
    default: () => []
  }
};

export class BuyerProcurementWorkflow {
  private llmService = LlmService.getInstance();
  private productTools = new ProductTools();
  private ragTools = new RAGTools();

  public build() {
    const builder = new AgentGraphBuilder<ProcurementState>(procurementStateChannels);

    builder
      .addNode('analyze_requirements', this.analyzeRequirementsNode.bind(this))
      .addNode('knowledge_retrieval', this.knowledgeRetrievalNode.bind(this))
      .addNode('search_marketplace', this.searchMarketplaceNode.bind(this))
      .addNode('generate_recommendations', this.generateRecommendationsNode.bind(this))
      .addNode('clarify_requirements', this.clarifyRequirementsNode.bind(this));

    builder.setEntryPoint('analyze_requirements');

    builder.addConditionalEdges(
      'analyze_requirements',
      (state) => {
        // We need at least a category or fabricType to perform a meaningful search
        if (state.requirements?.category || state.requirements?.fabricType) {
          return 'knowledge_retrieval';
        }
        return 'clarify_requirements';
      }
    );

    builder.addEdge('knowledge_retrieval', 'search_marketplace');
    builder.addEdge('search_marketplace', 'generate_recommendations');
    builder.setFinishPoint('generate_recommendations');
    builder.setFinishPoint('clarify_requirements');

    return builder.compile();
  }

  private async analyzeRequirementsNode(state: ProcurementState): Promise<Partial<ProcurementState>> {
    const model = this.llmService.getProvider().getChatModel();
    const extractorModel = model.withStructuredOutput(ExtractedRequirementsSchema);

    const lastMessage = state.messages[state.messages.length - 1];
    if (!(lastMessage instanceof HumanMessage)) return {};

    const systemPrompt = await ProcurementExtractionPrompt.format({
      currentRequirements: JSON.stringify(state.requirements || {}),
      message: lastMessage.content
    });

    try {
      const result = await extractorModel.invoke([
        new SystemMessage(systemPrompt),
        lastMessage
      ]);

      return {
        requirements: result.extractedRequirements,
        language: result.detectedLanguage || state.language || 'en'
      };
    } catch (error) {
      console.error('Extraction error', error);
      return {};
    }
  }

  private async knowledgeRetrievalNode(state: ProcurementState & { retrievedKnowledge?: string }): Promise<Partial<ProcurementState & { retrievedKnowledge?: string }>> {
    const tool = this.ragTools.getRetrieveTextileKnowledgeTool();
    const query = state.requirements.fabricType || state.requirements.category || '';
    if (!query) return {};
    
    const result = await tool.invoke({ topic: query });
    return { retrievedKnowledge: result };
  }

  private async searchMarketplaceNode(state: ProcurementState): Promise<Partial<ProcurementState>> {
    const searchTool = this.ragTools.getSemanticProductSearchTool();
    
    const query = state.requirements.fabricType || state.requirements.category || '';

    const result = await searchTool.invoke({ 
      query
    });

    return {
      foundProducts: JSON.parse(result)
    };
  }

  private async generateRecommendationsNode(state: ProcurementState & { retrievedKnowledge?: string }): Promise<Partial<ProcurementState>> {
    const model = this.llmService.getProvider().getChatModel();
    
    const systemPrompt = await ProcurementRecommendationPrompt.format({
      language: state.language || 'English',
      requirements: JSON.stringify(state.requirements),
      products: JSON.stringify(state.foundProducts || []),
      suppliers: JSON.stringify(state.foundSuppliers || [])
    });

    const knowledgeContext = state.retrievedKnowledge ? `\n\nTextile Knowledge Context:\n${state.retrievedKnowledge}\nUse this context to enrich your explanation.` : '';

    const response = await model.invoke([
      new SystemMessage(systemPrompt + knowledgeContext),
      ...state.messages
    ]);

    return {
      recommendationSummary: response.content as string,
      messages: [response]
    };
  }

  private async clarifyRequirementsNode(state: ProcurementState): Promise<Partial<ProcurementState>> {
    const model = this.llmService.getProvider().getChatModel();
    
    const systemPrompt = await ProcurementClarificationPrompt.format({
      language: state.language || 'English',
      requirements: JSON.stringify(state.requirements)
    });

    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      ...state.messages
    ]);

    return {
      messages: [response]
    };
  }
}
