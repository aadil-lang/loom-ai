import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { InMemoryVectorStore } from '../rag/InMemoryVectorStore';
import { EmbeddingService } from '../embeddings/EmbeddingService';
import { ProductService } from '../../services/ProductService';

export class RAGTools {
  private vectorStore = InMemoryVectorStore.getInstance();
  private embeddingService = EmbeddingService.getInstance();
  private productService = new ProductService();

  public getSemanticProductSearchTool() {
    return new DynamicStructuredTool({
      name: 'semantic_product_search',
      description: 'Find products conceptually related to the query using hybrid semantic search.',
      schema: z.object({
        query: z.string().describe('Natural language description of the desired product'),
      }),
      func: async ({ query }) => {
        try {
          const queryVec = await this.embeddingService.embedQuery(query);
          
          // 1. Vector Search
          const semanticResults = await this.vectorStore.similaritySearchVectorWithScore(queryVec, 5, { type: 'product' });
          
          // 2. Structured Fallback (Hybrid) if we don't have enough semantic matches
          const structuredResults = await this.productService.searchProducts({ search: query, limit: 5 });

          const combined = {
            semanticMatches: semanticResults.map(r => ({ ...r[0].metadata, score: r[1] })),
            keywordMatches: structuredResults.data
          };

          return JSON.stringify(combined);
        } catch (error: any) {
          return `Error in semantic product search: ${error.message}`;
        }
      }
    });
  }

  public getRetrieveTextileKnowledgeTool() {
    return new DynamicStructuredTool({
      name: 'retrieve_textile_knowledge',
      description: 'Retrieve factual documentation about fabrics, textiles, or platform policies to ground your answers.',
      schema: z.object({
        topic: z.string().describe('The topic or question to search for in the knowledge base'),
      }),
      func: async ({ topic }) => {
        try {
          const queryVec = await this.embeddingService.embedQuery(topic);
          const results = await this.vectorStore.similaritySearchVectorWithScore(queryVec, 3, { type: 'knowledge' });
          
          if (results.length === 0) return 'No knowledge found on this topic. Answer based on general knowledge but state uncertainty.';

          const context = results.map(r => `Source: ${r[0].metadata.sourceTitle}\nContext: ${r[0].pageContent}`).join('\n\n');
          return context;
        } catch (error: any) {
          return `Error retrieving knowledge: ${error.message}`;
        }
      }
    });
  }
}
