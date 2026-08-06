import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../../services/marketplace/ReviewService';
import { ApiResponse } from '../../responses/ApiResponse';
import { ForbiddenError } from '../../errors/CustomErrors';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  getReviewsByProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.productId as string;
      const reviews = await this.reviewService.getReviewsByProduct(productId);
      res.status(200).json(ApiResponse.success(reviews, 'Reviews retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getReviewsByBuyer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== 'Buyer') {
        throw new ForbiddenError('Only buyers can view their reviews this way');
      }
      const reviews = await this.reviewService.getReviewsByBuyer(req.user.id);
      res.status(200).json(ApiResponse.success(reviews, 'Reviews retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getReviewsBySupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== 'Supplier') {
        throw new ForbiddenError('Only suppliers can view their reviews this way');
      }
      const reviews = await this.reviewService.getReviewsBySupplier(req.user.id);
      res.status(200).json(ApiResponse.success(reviews, 'Reviews retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getReviewById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const review = await this.reviewService.getReviewById(id);
      res.status(200).json(ApiResponse.success(review, 'Review retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== 'Buyer') {
        throw new ForbiddenError('Only buyers can submit reviews');
      }
      const review = await this.reviewService.createReview(req.body, req.user.id);
      res.status(201).json(ApiResponse.success(review, 'Review submitted successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== 'Buyer') {
        throw new ForbiddenError('Only buyers can edit reviews');
      }
      const id = req.params.id as string;
      const review = await this.reviewService.updateReview(id, req.body, req.user.id);
      res.status(200).json(ApiResponse.success(review, 'Review updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== 'Buyer') {
        throw new ForbiddenError('Only buyers can delete reviews');
      }
      const id = req.params.id as string;
      await this.reviewService.deleteReview(id, req.user.id);
      res.status(200).json(ApiResponse.success(null, 'Review deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
