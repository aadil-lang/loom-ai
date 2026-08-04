import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/CategoryService';
import { ApiResponse } from '../responses/ApiResponse';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.categoryService.getAllCategories();
      res.status(200).json(ApiResponse.success(result, 'Categories retrieved'));
    } catch (error) {
      next(error);
    }
  };

  getCategoryDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.categoryService.getCategoryById(req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Category details retrieved'));
    } catch (error) {
      next(error);
    }
  };
}
