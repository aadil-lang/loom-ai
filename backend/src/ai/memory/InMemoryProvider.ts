import { IMemoryProvider } from './IMemoryProvider';

/**
 * A simple in-memory cache for session state.
 * In a production environment, this would be backed by Redis or MongoDB.
 */
export class InMemoryProvider implements IMemoryProvider {
  private cache = new Map<string, Record<string, any>>();

  async saveContext(sessionId: string, context: Record<string, any>): Promise<void> {
    const existing = this.cache.get(sessionId) || {};
    this.cache.set(sessionId, { ...existing, ...context });
  }

  async loadContext(sessionId: string): Promise<Record<string, any>> {
    return this.cache.get(sessionId) || {};
  }

  async clear(sessionId: string): Promise<void> {
    this.cache.delete(sessionId);
  }
}
