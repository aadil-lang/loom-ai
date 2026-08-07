import { ProductRepository } from '../repositories/ProductRepository';
import { IProduct } from '../models/Product';
import { NotFoundError } from '../errors/CustomErrors';
import { ProductQueryDto } from '../dto/marketplace/ProductQueryDto';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProductDetails(id: string): Promise<IProduct> {
    // Try _id first, then fall back to the 'id' field (Atlas data uses both)
    let product = await this.productRepository.findById(id);
    if (!product) {
      product = await this.productRepository.findOne({ id } as any);
    }
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    // Record view for 'Popular' sorting (AI/Marketplace metric)
    await this.productRepository.update((product as any)._id?.toString() || id, { $inc: { viewCount: 1 } });
    return product;
  }

  async searchProducts(dto: ProductQueryDto) {
    const { data, total } = await this.productRepository.searchAndFilter(dto);
    const page = dto.page || 1;
    const limit = dto.limit || 20;

    return {
      data,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        pageSize: limit,
        hasNext: page * limit < total,
        hasPrevious: page > 1
      }
    };
  }

  async getFeaturedProducts() {
    return await this.productRepository.getFeatured();
  }

  async getNewArrivals() {
    return await this.productRepository.getNewArrivals();
  }

  async getRelatedProducts(id: string) {
    return await this.productRepository.getRelated(id);
  }

  // ==========================================
  // AI-Ready Service Methods (LangGraph Tools)
  // ==========================================

  /**
   * Future LangGraph Agent will use this to find similar products
   * currently relies on metadata overlap, future will use Vector Embeddings.
   */
  async findSimilarProducts(productId: string): Promise<IProduct[]> {
    return await this.getRelatedProducts(productId);
  }

  /**
   * AI Tool to compare two or more products directly.
   */
  async compareProducts(productIds: string[]): Promise<IProduct[]> {
    const filter = { _id: { $in: productIds } };
    return await this.productRepository.findAll(filter);
  }

  /**
   * AI Tool to find alternatives if a product is out of stock.
   */
  async findAlternativeProducts(productId: string): Promise<IProduct[]> {
    const product = await this.getProductDetails(productId);
    const dto: ProductQueryDto = {
      category: product.categoryId.toString(),
      fabricType: product.fabricType,
      limit: 5,
      sortBy: 'popular'
    };
    const { data } = await this.productRepository.searchAndFilter(dto);
    return data.filter(p => p._id.toString() !== productId);
  }
}
