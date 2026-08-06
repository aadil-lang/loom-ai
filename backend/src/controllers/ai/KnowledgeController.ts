import { Request, Response, NextFunction } from 'express';
import { KnowledgeService } from '../../services/ai/KnowledgeService';
import { ApiResponse } from '../../responses/ApiResponse';

export class KnowledgeController {
  private knowledgeService: KnowledgeService;

  constructor() {
    this.knowledgeService = new KnowledgeService();
  }

  searchArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, category, difficulty, tags, sort, page, limit } = req.query;
      
      const filters = {
        category: category as string,
        difficulty: difficulty as string,
        tags: tags as string
      };

      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      
      const result = await this.knowledgeService.searchArticles(
        (q as string) || '', 
        filters, 
        pageNum, 
        limitNum,
        (sort as string) || 'newest'
      );
      
      res.status(200).json(ApiResponse.success(result, 'Articles retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug as string;
      const article = await this.knowledgeService.getArticleBySlug(slug);
      res.status(200).json(ApiResponse.success(article, 'Article retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getRelatedArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug as string;
      const related = await this.knowledgeService.getRelatedArticles(slug);
      res.status(200).json(ApiResponse.success(related, 'Related articles retrieved'));
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.knowledgeService.getCategories();
      res.status(200).json(ApiResponse.success(categories, 'Categories retrieved'));
    } catch (error) {
      next(error);
    }
  };
}
