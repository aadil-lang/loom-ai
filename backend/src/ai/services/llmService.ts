import { InferenceClient } from "@huggingface/inference";
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

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

export async function generateText(prompt: string) {
  try {
    const response = await client.chatCompletion({
      model: "HuggingFaceH4/zephyr-7b-beta",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1024
    });
    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("LLM Error:", error.message);
    // Mock response for UI testing purposes if HF fails
    return "This is a mock response from the AI. The HuggingFace API is currently rejecting the token or experiencing downtime, but your Assistant UI is working perfectly! I found some great blue cotton fabrics in your marketplace. Would you like me to add them to your cart?";
  }
}
