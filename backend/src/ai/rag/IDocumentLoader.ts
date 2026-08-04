export interface IDocumentLoader {
  /**
   * Load documents from a source (file, db, api) into a format suitable for processing.
   */
  load(): Promise<any[]>;
}
