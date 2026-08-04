export interface IRetriever {
  /**
   * Retrieve relevant documents or context based on a query.
   */
  retrieve(query: string, k?: number): Promise<any[]>;
}
