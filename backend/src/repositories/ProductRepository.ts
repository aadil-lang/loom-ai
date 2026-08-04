import { Product, IProduct } from '../models/Product';
import { BaseRepository } from './BaseRepository';

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product);
  }

  // Add specific repository methods here, e.g. text search
  async searchByText(query: string, limit: number = 10): Promise<IProduct[]> {
    return await this.model.find({ $text: { $search: query } }).limit(limit).exec();
  }

  async findBySupplier(supplierId: string): Promise<IProduct[]> {
    return await this.model.find({ supplierId }).exec();
  }
}
