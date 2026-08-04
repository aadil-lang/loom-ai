import { BaseMessage } from '@langchain/core/messages';

export interface BaseAgentState {
  messages: BaseMessage[];
  // Extensible for future agent-specific state like 'currentQuery', 'supplierId', etc.
  context?: Record<string, any>;
}
