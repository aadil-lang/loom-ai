import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';
import { ApiResponse } from '../responses/ApiResponse';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.searchProducts(req.query);
      res.status(200).json(ApiResponse.success(result.data, 'Products retrieved successfully', result.meta));
    } catch (error) {
      next(error);
    }
  };

  getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.getProductDetails(req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Product details retrieved'));
    } catch (error) {
      next(error);
    }
  };

  getFeatured = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.getFeaturedProducts();
      res.status(200).json(ApiResponse.success(result, 'Featured products retrieved'));
    } catch (error) {
      next(error);
    }
  };

  getNewArrivals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.getNewArrivals();
      res.status(200).json(ApiResponse.success(result, 'New arrivals retrieved'));
    } catch (error) {
      next(error);
    }
  };

  getRelated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.getRelatedProducts(req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Related products retrieved'));
    } catch (error) {
      next(error);
    }
  };
}
