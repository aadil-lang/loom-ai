import { AgentGraphBuilder } from '../graphs/AgentGraphBuilder';
import { MultiAgentState, multiAgentStateChannels } from '../schemas/GraphState';
import { LlmService } from '../services/llmService';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';

export class MarketplaceWorkflow {
  private llmService = LlmService.getInstance();

  public build() {
    const builder = new AgentGraphBuilder<MultiAgentState>(multiAgentStateChannels);
    
    // We'll just define a single node for the Marketplace agent for now
    builder.addNode('marketplace_agent', this.marketplaceAgentNode.bind(this));
    builder.setEntryPoint('marketplace_agent');
    builder.setFinishPoint('marketplace_agent');
    
    return builder.compile();
  }

  private async marketplaceAgentNode(state: MultiAgentState): Promise<Partial<MultiAgentState>> {
    const messages = state.messages;
    if (!messages || messages.length === 0) return {};
    
    const lastMessage = messages[messages.length - 1];
    
    // In a real LangGraph setup, we'd use function calling (withStructuredOutput)
    // to extract the filters and then hit the API. 
    // Here we'll do a simple prompt extraction for demo purposes.
    const systemPrompt = `You are the Marketplace Agent. The user wants to search for fabrics.
Extract their intent into filters if possible.
Allowed filters: material (Cotton, Silk, Linen, etc.), minPrice, maxPrice, state (Gujarat, Maharashtra, etc.).
If you can extract filters, respond with EXACTLY this format:
[FILTER: {"material": "cotton", "maxPrice": 100}]
If you can't, just chat naturally with the user about what they are looking for.`;

    const llm = this.llmService.getProvider().getLLM();
    
    try {
      const response = await llm.invoke([
        new SystemMessage(systemPrompt),
        lastMessage
      ]);
      
      const content = typeof response === 'string' ? response : response.content.toString();
      
      return { 
        messages: [new AIMessage(content)],
        // Switch back to supervisor after one turn, or FINISH
        nextAgent: 'FINISH' 
      };
    } catch (e) {
      console.error('Marketplace LLM Error:', e);
      return { 
        messages: [new AIMessage("I'm having trouble searching the marketplace right now.")],
        nextAgent: 'FINISH'
      };
    }
  }
}
