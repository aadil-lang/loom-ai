import { IVectorStore, DocumentChunk } from './IVectorStore';
import { EmbeddingService } from '../embeddings/EmbeddingService';

export class InMemoryVectorStore implements IVectorStore {
  private static instance: InMemoryVectorStore;
  private documents: DocumentChunk[] = [];
  private embeddingService = EmbeddingService.getInstance();

  private constructor() {}

  public static getInstance(): InMemoryVectorStore {
    if (!InMemoryVectorStore.instance) {
      InMemoryVectorStore.instance = new InMemoryVectorStore();
    }
    return InMemoryVectorStore.instance;
  }

  async addDocuments(docs: DocumentChunk[]): Promise<void> {
    for (const doc of docs) {
      if (!doc.embedding) {
        doc.embedding = await this.embeddingService.embedQuery(doc.pageContent);
      }
      this.documents.push(doc);
    }
  }

  async similaritySearchVectorWithScore(
    queryEmbedding: number[],
    k: number,
    filter?: Record<string, any>
  ): Promise<[DocumentChunk, number][]> {
    
    // Calculate cosine similarity
    const scoredDocs = this.documents.map(doc => {
      const score = this.cosineSimilarity(queryEmbedding, doc.embedding!);
      return [doc, score] as [DocumentChunk, number];
    });

    // Filter if needed
    const filtered = filter ? scoredDocs.filter(([doc]) => {
      for (const key in filter) {
        if (doc.metadata[key] !== filter[key]) return false;
      }
      return true;
    }) : scoredDocs;

    // Sort descending by score
    filtered.sort((a, b) => b[1] - a[1]);

    return filtered.slice(0, k);
  }

  async delete(filter: Record<string, any>): Promise<void> {
    this.documents = this.documents.filter(doc => {
      for (const key in filter) {
        if (doc.metadata[key] === filter[key]) return false; // delete it
      }
      return true;
    });
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
