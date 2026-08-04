import { ILLMProvider } from '../providers/ILLMProvider';
import { GroqProvider } from '../providers/GroqProvider';
import { HuggingFaceProvider } from '../providers/HuggingFaceProvider';
import { aiConfig } from '../config/aiConfig';

export class LlmService {
  private static instance: LlmService;
  private provider: ILLMProvider;

  private constructor() {
    this.provider = this.initializeProvider();
  }

  public static getInstance(): LlmService {
    if (!LlmService.instance) {
      LlmService.instance = new LlmService();
    }
    return LlmService.instance;
  }

  private initializeProvider(): ILLMProvider {
    switch (aiConfig.provider.toLowerCase()) {
      case 'huggingface':
        return new HuggingFaceProvider(aiConfig.huggingface.apiKey, aiConfig.huggingface.defaultModel, aiConfig.temperature);
      case 'groq':
      default:
        return new GroqProvider(aiConfig.groq.apiKey, aiConfig.groq.defaultModel, aiConfig.temperature);
    }
  }

  /**
   * Returns the configured provider.
   */
  public getProvider(): ILLMProvider {
    return this.provider;
  }
}
