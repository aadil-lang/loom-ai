import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BaseLLM } from '@langchain/core/language_models/llms';

export interface ILLMProvider {
  /**
   * Returns the underlying Chat Model instance configured for the provider.
   */
  getChatModel(): BaseChatModel;

  /**
   * Returns an LLM instance if applicable.
   */
  getLLM(): BaseLLM | BaseChatModel;

  /**
   * Name of the provider (e.g. 'groq', 'huggingface')
   */
  getProviderName(): string;
}
