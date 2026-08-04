export interface IMemoryProvider {
  /**
   * Save context or variables related to a specific conversation or user.
   */
  saveContext(sessionId: string, context: Record<string, any>): Promise<void>;

  /**
   * Load context or variables related to a specific conversation or user.
   */
  loadContext(sessionId: string): Promise<Record<string, any>>;

  /**
   * Clear the memory for a given session.
   */
  clear(sessionId: string): Promise<void>;
}
