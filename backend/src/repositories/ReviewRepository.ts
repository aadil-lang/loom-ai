import { Review, IReview } from '../models/Review';
import { BaseRepository } from './BaseRepository';

export class ReviewRepository extends BaseRepository<IReview> {
  constructor() {
    super(Review);
  }

  async findByProductId(productId: string): Promise<IReview[]> {
    return await this.model.find({ productId }).sort({ createdAt: -1 }).populate('buyerId', 'name contactName').lean().exec() as IReview[];
  }

  async findBySupplierId(supplierId: string): Promise<IReview[]> {
    return await this.model.find({ supplierId }).sort({ createdAt: -1 }).populate('buyerId', 'name contactName').populate('productId', 'name images').lean().exec() as IReview[];
  }

  async findByBuyerId(buyerId: string): Promise<IReview[]> {
    return await this.model.find({ buyerId }).sort({ createdAt: -1 }).populate('productId', 'name images supplierId').lean().exec() as IReview[];
  }

  async getProductRatingAggregation(productId: string): Promise<{ avgRating: number; reviewCount: number }> {
    const result = await this.model.aggregate([
      { $match: { productId: productId } }, // Note: may need mongoose.Types.ObjectId(productId) depending on mongoose version, but string usually works in $match if cast correctly, let's use exact match or mongoose casts it in aggregate. Actually mongoose doesn't auto-cast in aggregate. We will cast it in the service.
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      return {
        avgRating: Math.round(result[0].avgRating * 10) / 10,
        reviewCount: result[0].reviewCount,
      };
    }
    return { avgRating: 0, reviewCount: 0 };
  }
}
