import { Product, IProduct } from '../models/Product';
import { BaseRepository } from './BaseRepository';
import { ProductQueryDto } from '../dto/marketplace/ProductQueryDto';
import mongoose from 'mongoose';

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product);
  }

  private buildFilterQuery(dto: ProductQueryDto): Record<string, any> {
    const filter: Record<string, any> = {};

    if (dto.search) {
      filter.$text = { $search: dto.search };
    }
    if (dto.category) {
      filter.categoryId = new mongoose.Types.ObjectId(dto.category);
    }
    if (dto.supplier) {
      filter.supplierId = new mongoose.Types.ObjectId(dto.supplier);
    }
    if (dto.fabricType) {
      filter.fabricType = dto.fabricType;
    }
    if (dto.colors) {
      filter.colors = { $in: dto.colors.split(',') };
    }
    if (dto.minPrice || dto.maxPrice) {
      filter.pricePerMeter = {};
      if (dto.minPrice) filter.pricePerMeter.$gte = dto.minPrice;
      if (dto.maxPrice) filter.pricePerMeter.$lte = dto.maxPrice;
    }
    if (dto.weaveType) filter.weaveType = dto.weaveType;
    if (dto.sustainabilityRating) filter.sustainabilityRating = dto.sustainabilityRating;
    if (dto.industryApplications) filter.industryApplications = dto.industryApplications;
    
    return filter;
  }

  private buildSort(sortBy?: string): Record<string, 1 | -1> {
    switch (sortBy) {
      case 'price_asc': return { pricePerMeter: 1 };
      case 'price_desc': return { pricePerMeter: -1 };
      case 'popular': return { viewCount: -1 };
      case 'trending': return { trendingScore: -1 };
      case 'newest':
      default:
        return { createdAt: -1 };
    }
  }

  async searchAndFilter(dto: ProductQueryDto): Promise<{ data: IProduct[]; total: number }> {
    const filter = this.buildFilterQuery(dto);
    const sort = this.buildSort(dto.sortBy);
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).populate('supplierId', 'name rating').populate('categoryId', 'name slug').exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return { data, total };
  }

  async getFeatured(limit = 10): Promise<IProduct[]> {
    return await this.model.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(limit).populate('supplierId', 'name rating').exec();
  }

  async getNewArrivals(limit = 10): Promise<IProduct[]> {
    return await this.model.find().sort({ createdAt: -1 }).limit(limit).populate('supplierId', 'name rating').exec();
  }

  async getRelated(productId: string, limit = 5): Promise<IProduct[]> {
    const product = await this.findById(productId);
    if (!product) return [];
    
    // Simple heuristic for related: same category, different product
    return await this.model.find({
      categoryId: product.categoryId,
      _id: { $ne: new mongoose.Types.ObjectId(productId) }
    }).limit(limit).exec();
  }

  async findBySupplier(supplierId: string): Promise<IProduct[]> {
    return await this.model.find({ supplierId }).exec();
  }
}
