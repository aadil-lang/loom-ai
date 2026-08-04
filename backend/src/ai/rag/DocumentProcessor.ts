import { DocumentChunk } from './IVectorStore';
import { v4 as uuidv4 } from 'uuid';

export class DocumentProcessor {
  
  /**
   * Naive chunking for Sprint 7.4.
   * Splits by double newlines, then newlines, then spaces up to a max chunk size.
   * Preserves metadata across all chunks.
   */
  public chunkText(text: string, metadata: Record<string, any>, chunkSize: number = 500, overlap: number = 50): DocumentChunk[] {
    const chunks: string[] = [];
    let currentChunk = '';

    const words = text.split(/\s+/);

    for (const word of words) {
      if ((currentChunk + ' ' + word).length > chunkSize) {
        if (currentChunk.trim().length > 0) {
          chunks.push(currentChunk.trim());
        }
        // naive overlap
        const wordsInOverlap = currentChunk.split(/\s+/).slice(-Math.floor(overlap / 5)); // assume avg 5 chars per word
        currentChunk = wordsInOverlap.join(' ') + ' ' + word;
      } else {
        currentChunk += ' ' + word;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks.map((chunk, index) => ({
      id: uuidv4(),
      pageContent: chunk,
      metadata: { ...metadata, chunkIndex: index }
    }));
  }
}
