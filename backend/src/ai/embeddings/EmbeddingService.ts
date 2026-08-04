import { IEmbeddingService } from './IEmbeddingService';

/**
 * A mock embedding service for development.
 * In a real environment, this would wrap HuggingFaceInferenceEmbeddings 
 * or OpenAIEmbeddings from LangChain.
 */
export class EmbeddingService implements IEmbeddingService {
  private static instance: EmbeddingService;

  private constructor() {}

  public static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    // Generate deterministic mock embeddings based on text length
    return texts.map(t => this.mockEmbed(t));
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.mockEmbed(text);
  }

  private mockEmbed(text: string): number[] {
    const vec = new Array(1536).fill(0);
    // simple hash-like mock
    for (let i = 0; i < text.length; i++) {
      vec[i % 1536] += text.charCodeAt(i) / 1000;
    }
    return vec;
  }
}
