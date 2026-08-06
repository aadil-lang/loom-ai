import mongoose from 'mongoose';
import { ReviewRepository } from '../../repositories/ReviewRepository';
import { ProductRepository } from '../../repositories/ProductRepository';
import { Order } from '../../models/Order';
import { NotFoundError, ForbiddenError, ConflictError } from '../../errors/CustomErrors';

export class ReviewService {
  private reviewRepo: ReviewRepository;
  private productRepo: ProductRepository;

  constructor() {
    this.reviewRepo = new ReviewRepository();
    this.productRepo = new ProductRepository();
  }

  async getReviewsByProduct(productId: string) {
    return await this.reviewRepo.findByProductId(productId);
  }

  async getReviewsByBuyer(buyerId: string) {
    return await this.reviewRepo.findByBuyerId(buyerId);
  }

  async getReviewsBySupplier(supplierId: string) {
    return await this.reviewRepo.findBySupplierId(supplierId);
  }

  async getReviewById(id: string) {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundError('Review not found');
    return review;
  }

  async createReview(data: any, buyerId: string) {
    const { productId, rating, title, comment } = data;

    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    // Check if buyer already reviewed this product
    const existingReview = await this.reviewRepo.findOne({ productId, buyerId });
    if (existingReview) {
      throw new ConflictError('You have already reviewed this product');
    }

    // Verify purchase
    const order = await Order.findOne({
      buyerId,
      'items.productId': productId,
      status: 'Completed'
    }).exec();

    if (!order) {
      throw new ForbiddenError('You can only review products you have purchased and received (Completed orders)');
    }

    const review = await this.reviewRepo.create({
      productId: new mongoose.Types.ObjectId(productId),
      buyerId: new mongoose.Types.ObjectId(buyerId),
      supplierId: product.supplierId,
      orderId: order._id as mongoose.Types.ObjectId,
      rating,
      title,
      comment,
      isVerifiedPurchase: true, // we verified it
    });

    await this.updateProductRating(productId);
    return review;
  }

  async updateReview(id: string, data: any, buyerId: string) {
    const review = await this.getReviewById(id);

    if (review.buyerId.toString() !== buyerId) {
      throw new ForbiddenError('You can only edit your own reviews');
    }

    const updated = await this.reviewRepo.update(id, {
      rating: data.rating !== undefined ? data.rating : review.rating,
      title: data.title !== undefined ? data.title : review.title,
      comment: data.comment !== undefined ? data.comment : review.comment,
    });

    await this.updateProductRating(review.productId.toString());
    return updated;
  }

  async deleteReview(id: string, buyerId: string) {
    const review = await this.getReviewById(id);

    if (review.buyerId.toString() !== buyerId) {
      throw new ForbiddenError('You can only delete your own reviews');
    }

    await this.reviewRepo.delete(id);
    await this.updateProductRating(review.productId.toString());
  }

  private async updateProductRating(productId: string) {
    const stats = await this.reviewRepo.getProductRatingAggregation(new mongoose.Types.ObjectId(productId) as any);
    await this.productRepo.update(productId, {
      rating: stats.avgRating,
      customerRatingSummary: JSON.stringify({ count: stats.reviewCount, average: stats.avgRating }),
    });
  }
}
