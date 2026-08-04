import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../responses/ApiResponse';
import { DocumentProcessor } from '../../ai/rag/DocumentProcessor';
import { InMemoryVectorStore } from '../../ai/rag/InMemoryVectorStore';
import { EmbeddingService } from '../../ai/embeddings/EmbeddingService';

const processor = new DocumentProcessor();
const vectorStore = InMemoryVectorStore.getInstance();
const embeddingService = EmbeddingService.getInstance();

export class RAGController {

  indexDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, metadata } = req.body;
      if (!text) {
        return res.status(400).json(ApiResponse.error('Text is required for indexing', 400));
      }

      const chunks = processor.chunkText(text, metadata || { type: 'knowledge', sourceTitle: 'Manual Upload' });
      
      // Index in background (or foreground for small texts)
      await vectorStore.addDocuments(chunks);

      res.status(200).json(ApiResponse.success({ chunksProcessed: chunks.length }, 'Document indexed successfully'));
    } catch (error) { next(error); }
  };

  semanticSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, k = 5, filter } = req.body;
      if (!query) {
        return res.status(400).json(ApiResponse.error('Query is required', 400));
      }

      const queryVec = await embeddingService.embedQuery(query);
      const results = await vectorStore.similaritySearchVectorWithScore(queryVec, k, filter);

      res.status(200).json(ApiResponse.success({
        results: results.map(r => ({
          content: r[0].pageContent,
          metadata: r[0].metadata,
          score: r[1]
        }))
      }, 'Search completed'));
    } catch (error) { next(error); }
  };
}
