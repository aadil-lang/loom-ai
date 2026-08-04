import { ChatGroq } from '@langchain/groq';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ILLMProvider } from './ILLMProvider';

export class GroqProvider implements ILLMProvider {
  private chatModel: ChatGroq;

  constructor(apiKey: string, model: string = 'llama3-8b-8192', temperature: number = 0) {
    this.chatModel = new ChatGroq({
      apiKey,
      model,
      temperature,
    });
  }

  getChatModel(): BaseChatModel {
    return this.chatModel;
  }

  getLLM(): BaseChatModel {
    // Groq primarily supports Chat models via Langchain
    return this.chatModel;
  }

  getProviderName(): string {
    return 'groq';
  }
}
