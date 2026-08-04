import { StateGraph, END, START } from '@langchain/langgraph';
import { BaseAgentState } from '../schemas/GraphState';

export class AgentGraphBuilder<T extends BaseAgentState> {
  private graph: StateGraph<T>;

  constructor(stateChannels: any) {
    this.graph = new StateGraph<T>({ channels: stateChannels });
  }

  public addNode(name: string, action: (state: T) => any | Promise<any>): this {
    this.graph.addNode(name as any, action);
    return this;
  }

  public addEdge(from: string, to: string): this {
    this.graph.addEdge(from as any, to as any);
    return this;
  }

  public addConditionalEdges(
    source: string,
    condition: (state: T) => string,
    pathMap?: Record<string, string>
  ): this {
    this.graph.addConditionalEdges(source as any, condition, pathMap as any);
    return this;
  }

  public setEntryPoint(nodeName: string): this {
    this.graph.addEdge(START, nodeName as any);
    return this;
  }

  public setFinishPoint(nodeName: string): this {
    this.graph.addEdge(nodeName as any, END);
    return this;
  }

  public compile() {
    return this.graph.compile();
  }
}
