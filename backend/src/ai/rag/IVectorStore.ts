export interface DocumentChunk {
  id: string;
  pageContent: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface IVectorStore {
  /**
   * Add documents with embeddings to the store.
   */
  addDocuments(documents: DocumentChunk[]): Promise<void>;

  /**
   * Search for similar documents based on a query embedding.
   */
  similaritySearchVectorWithScore(
    queryEmbedding: number[],
    k: number,
    filter?: Record<string, any>
  ): Promise<[DocumentChunk, number][]>;

  /**
   * Remove a document from the store.
   */
  delete(filter: Record<string, any>): Promise<void>;
}
