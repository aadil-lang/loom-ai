export interface IEmbeddingService {
  /**
   * Generate embeddings for a list of texts.
   */
  embedDocuments(texts: string[]): Promise<number[][]>;

  /**
   * Generate an embedding for a single query.
   */
  embedQuery(text: string): Promise<number[]>;
}
