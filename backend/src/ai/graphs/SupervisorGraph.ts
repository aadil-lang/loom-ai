import { AgentGraphBuilder } from './AgentGraphBuilder';
import { MultiAgentState, multiAgentStateChannels } from '../schemas/GraphState';
import { LlmService } from '../services/llmService';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { MarketplaceWorkflow } from '../workflows/MarketplaceWorkflow';

export class SupervisorGraph {
  private llmService = LlmService.getInstance();

  public build() {
    const builder = new AgentGraphBuilder<MultiAgentState>(multiAgentStateChannels);

    const marketplaceApp = new MarketplaceWorkflow().build();

    builder
      .addNode('supervisor', this.supervisorNode.bind(this))
      .addNode('Marketplace', async (state: any): Promise<any> => {
        const result = await marketplaceApp.invoke(state);
        return result as any;
      })
      .addNode('Knowledge', this.knowledgeAgentMock.bind(this))
      .addNode('Buyer', this.buyerAgentMock.bind(this))
      .addNode('Supplier', this.supplierAgentMock.bind(this))
      .addNode('BusinessAdvisor', this.businessAdvisorAgentMock.bind(this))
      .addNode('Negotiation', this.negotiationAgentMock.bind(this));

    builder.setEntryPoint('supervisor');

    builder.addConditionalEdges('supervisor', (state) => {
      if (!state.nextAgent || state.nextAgent === 'FINISH') {
        return 'FINISH'; // This isn't technically a node, graph ends automatically if no path
      }
      return state.nextAgent;
    }, {
      Marketplace: 'Marketplace',
      Knowledge: 'Knowledge',
      Buyer: 'Buyer',
      Supplier: 'Supplier',
      BusinessAdvisor: 'BusinessAdvisor',
      Negotiation: 'Negotiation',
      FINISH: 'supervisor' // fallback, not used typically if we finish
    });

    // Sub-agents return to supervisor (or FINISH)
    builder.addEdge('Marketplace', 'supervisor');
    builder.addEdge('Knowledge', 'supervisor');
    builder.addEdge('Buyer', 'supervisor');
    builder.addEdge('Supplier', 'supervisor');
    builder.addEdge('BusinessAdvisor', 'supervisor');
    builder.addEdge('Negotiation', 'supervisor');

    return builder.compile();
  }

  private async supervisorNode(state: MultiAgentState): Promise<Partial<MultiAgentState>> {
    const messages = state.messages;
    if (!messages || messages.length === 0) return { nextAgent: 'FINISH' };
    
    const lastMessage = messages[messages.length - 1];
    
    // If the last message is from AI, we are done routing for this turn
    if (lastMessage instanceof AIMessage) {
      return { nextAgent: 'FINISH' };
    }

    const systemPrompt = `You are the Supervisor Agent for LoomAI, a B2B Textile Sourcing Platform.
Your job is to route the user's request to the correct specialized agent.
Available Agents:
- Marketplace: For searching fabrics, finding products, filters, prices.
- Knowledge: For textile terms, certifications, manufacturing info, RAG queries.
- Buyer: For procurement advice, matching, MOQ questions.
- Supplier: For generating listings, SEO, quoting.
- BusinessAdvisor: For analytics, revenue, inventory insights.
- Negotiation: For drafting RFQs, bargaining, counter-offers.

User Role: ${state.userRole || 'Unknown'}

Analyze the conversation and respond with EXACTLY ONE WORD from the list above. If the conversation is over or just a greeting that you can answer, respond with "FINISH".`;

    const llm = this.llmService.getProvider().getLLM();
    let result = '';
    
    try {
      const response = await llm.invoke([
        new SystemMessage(systemPrompt),
        ...messages
      ]);
      result = typeof response === 'string' ? response.trim() : response.content.toString().trim();
    } catch (e) {
      console.error('Supervisor LLM Error:', e);
      result = 'FINISH'; // Fallback
    }

    const validAgents = ['Marketplace', 'Knowledge', 'Buyer', 'Supplier', 'BusinessAdvisor', 'Negotiation', 'FINISH'];
    const nextAgent = validAgents.find(a => result.includes(a)) as MultiAgentState['nextAgent'] || 'FINISH';

    return { nextAgent };
  }

  // --- Mocks for Sub-Agents (Phase 2 completion will expand these) ---
  private async knowledgeAgentMock(state: MultiAgentState): Promise<Partial<MultiAgentState>> {
    const msg = new AIMessage("Knowledge Agent: I have access to LoomAI's textile knowledge base. Ask me about certifications or materials.");
    return { messages: [msg] };
  }

  private async buyerAgentMock(state: MultiAgentState): Promise<Partial<MultiAgentState>> {
    const msg = new AIMessage("Buyer Procurement Agent: I can help you find the perfect supplier and manage MOQs.");
    return { messages: [msg] };
  }

  private async supplierAgentMock(state: MultiAgentState): Promise<Partial<MultiAgentState>> {
    const msg = new AIMessage("Supplier Assistant: I can help optimize your product listings and respond to buyers.");
    return { messages: [msg] };
  }

  private async businessAdvisorAgentMock(state: MultiAgentState): Promise<Partial<MultiAgentState>> {
    const msg = new AIMessage("Business Advisor: Let's look at your analytics and sales performance.");
    return { messages: [msg] };
  }

  private async negotiationAgentMock(state: MultiAgentState): Promise<Partial<MultiAgentState>> {
    const msg = new AIMessage("Negotiation Assistant: I can help you draft a professional RFQ or counter-offer.");
    return { messages: [msg] };
  }
}
