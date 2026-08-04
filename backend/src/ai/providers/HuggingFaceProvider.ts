import { HuggingFaceInference } from '@langchain/community/llms/hf';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BaseLLM } from '@langchain/core/language_models/llms';
import { ILLMProvider } from './ILLMProvider';

export class HuggingFaceProvider implements ILLMProvider {
  private llm: HuggingFaceInference;

  constructor(apiKey: string, model: string = 'meta-llama/Llama-2-7b-chat-hf', temperature: number = 0) {
    this.llm = new HuggingFaceInference({
      apiKey,
      model,
      temperature,
    });
  }

  getChatModel(): BaseChatModel {
    throw new Error('HuggingFaceInference primarily provides BaseLLM. Use getLLM() instead or wrap it in a ChatHuggingFace instance if available.');
  }

  getLLM(): BaseLLM {
    return this.llm;
  }

  getProviderName(): string {
    return 'huggingface';
  }
}
