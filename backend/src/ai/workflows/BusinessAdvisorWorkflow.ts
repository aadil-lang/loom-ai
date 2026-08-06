import { AgentGraphBuilder } from '../graphs/AgentGraphBuilder';
import { BusinessAdvisorState, BusinessReportSchema } from '../schemas/BusinessAdvisorSchemas';
import { LlmService } from '../services/llmService';
import { AdvisorSystemPrompt } from '../prompts/advisorPrompts';
import { AnalyticsTools } from '../tools/AnalyticsTools';
import { RAGTools } from '../tools/RAGTools';
import { SystemMessage } from '@langchain/core/messages';

const advisorStateChannels = {
  userType: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined },
  userId: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined },
  rawMetrics: {
    reducer: (a: any, b: any) => ({ ...a, ...b }),
    default: () => ({})
  },
  marketContext: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined },
  generatedReport: { reducer: (a: any, b: any) => b !== undefined ? b : a, default: () => undefined }
};

export class BusinessAdvisorWorkflow {
  private llmService = LlmService.getInstance();
  private analyticsTools = new AnalyticsTools();
  private ragTools = new RAGTools();

  public build() {
    const builder = new AgentGraphBuilder<BusinessAdvisorState>(advisorStateChannels);

    builder
      .addNode('collect_metrics', this.collectMetricsNode.bind(this))
      .addNode('retrieve_market_context', this.retrieveMarketContextNode.bind(this))
      .addNode('generate_insights', this.generateInsightsNode.bind(this));

    builder.setEntryPoint('collect_metrics');
    builder.addEdge('collect_metrics', 'retrieve_market_context');
    builder.addEdge('retrieve_market_context', 'generate_insights');
    builder.setFinishPoint('generate_insights');

    return builder.compile();
  }

  private async collectMetricsNode(state: BusinessAdvisorState): Promise<Partial<BusinessAdvisorState>> {
    let rawMetrics = {};
    
    if (state.userType === 'supplier') {
      const tool = this.analyticsTools.getSupplierMetricsTool();
      const res = await tool.invoke({ supplierId: state.userId });
      rawMetrics = JSON.parse(res);
      
      // Add a predictive heuristic simulation
      const forecastTool = this.analyticsTools.getInventoryForecastTool();
      const forecast = await forecastTool.invoke({ productId: 'sample-top-seller' });
      rawMetrics = { ...rawMetrics, forecast: JSON.parse(forecast) };
    } else {
      const tool = this.analyticsTools.getBuyerMetricsTool();
      const res = await tool.invoke({ buyerId: state.userId });
      rawMetrics = JSON.parse(res);
    }

    return { rawMetrics };
  }

  private async retrieveMarketContextNode(state: BusinessAdvisorState): Promise<Partial<BusinessAdvisorState>> {
    const tool = this.ragTools.getRetrieveTextileKnowledgeTool();
    // Retrieve general trending market info. Hardcoded topic for now, 
    // in real scenario we'd query based on the mostPurchasedCategory from rawMetrics.
    const category = state.rawMetrics?.mostPurchasedCategory || 'Market Trends';
    const result = await tool.invoke({ topic: `Latest trends and demand in ${category}` });
    
    return { marketContext: result };
  }

  private async generateInsightsNode(state: BusinessAdvisorState): Promise<Partial<BusinessAdvisorState>> {
    const model = this.llmService.getProvider().getChatModel();
    const structuredModel = model.withStructuredOutput(BusinessReportSchema);

    const systemPrompt = await AdvisorSystemPrompt.format({
      userType: state.userType,
      metrics: JSON.stringify(state.rawMetrics),
      context: state.marketContext || 'No additional context.'
    });

    try {
      const report = await structuredModel.invoke([
        new SystemMessage(systemPrompt)
      ]);

      return { generatedReport: report };
    } catch (error) {
      console.error('Report Generation Error', error);
      return {};
    }
  }
}
