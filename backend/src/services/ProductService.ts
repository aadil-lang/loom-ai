import { ProductRepository } from '../repositories/ProductRepository';
import { IProduct } from '../models/Product';
import { NotFoundError } from '../errors/CustomErrors';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  async searchProducts(query: string): Promise<IProduct[]> {
    // AI Agents can utilize this for RAG lookups
    return await this.productRepository.searchByText(query);
  }

  // Future LangGraph Agent Integration Placeholder
  async getInventorySummary(supplierId: string) {
    const products = await this.productRepository.findBySupplier(supplierId);
    return {
      totalProducts: products.length,
      inStock: products.filter(p => p.inStock).length,
      // Aggregations would normally be done in DB, but this is a placeholder
    };
  }
}
