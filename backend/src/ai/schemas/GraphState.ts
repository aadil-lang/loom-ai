import { BaseMessage } from '@langchain/core/messages';

export interface BaseAgentState {
  messages: BaseMessage[];
  // Extensible for future agent-specific state like 'currentQuery', 'supplierId', etc.
  context?: Record<string, any>;
}

export interface MultiAgentState extends BaseAgentState {
  [key: string]: any;
  nextAgent?: 'Buyer' | 'Supplier' | 'Marketplace' | 'Knowledge' | 'BusinessAdvisor' | 'Negotiation' | 'FINISH';
  userRole?: 'Buyer' | 'Supplier';
  userId?: string;
  activeContextId?: string; // e.g. productId, supplierId for contextual queries
  language?: string;
}

export const multiAgentStateChannels = {
  messages: {
    reducer: (a: BaseMessage[], b: BaseMessage[]) => a.concat(b),
    default: () => [],
  },
  context: {
    reducer: (a: any, b: any) => ({ ...a, ...b }),
    default: () => ({}),
  },
  nextAgent: {
    reducer: (a: any, b: any) => b !== undefined ? b : a,
    default: () => undefined
  },
  userRole: {
    reducer: (a: any, b: any) => b !== undefined ? b : a,
    default: () => undefined
  },
  userId: {
    reducer: (a: any, b: any) => b !== undefined ? b : a,
    default: () => undefined
  },
  activeContextId: {
    reducer: (a: any, b: any) => b !== undefined ? b : a,
    default: () => undefined
  },
  language: {
    reducer: (a: any, b: any) => b !== undefined ? b : a,
    default: () => undefined
  },
};
