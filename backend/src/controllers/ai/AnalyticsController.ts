import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../../services/ai/AnalyticsService';
import { ApiResponse } from '../../responses/ApiResponse';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getBuyerAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // For now, use mocked user ID if not provided in token
      const buyerId = req.user?.id || '60d21b4667d0d8992e610c85';
      const data = await this.analyticsService.getBuyerAnalytics(buyerId);
      res.status(200).json(ApiResponse.success(data, 'Buyer analytics retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getSupplierAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // For now, allow passing supplierId via query or use token
      const supplierId = (req.query.supplierId as string) || req.user?.id || '60d21b4667d0d8992e610c86'; // Needs a valid mock ID or dynamic
      // Note: in SupplierDashboardPage, we hardcode 's1', but we should map that or just use the first supplier
      const sId = (supplierId === 's1' || supplierId === '60d21b4667d0d8992e610c86') ? await this.getFirstSupplierId() : supplierId;
      
      const data = await this.analyticsService.getSupplierAnalytics(sId);
      res.status(200).json(ApiResponse.success(data, 'Supplier analytics retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getMarketplaceAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.analyticsService.getMarketplaceAnalytics();
      res.status(200).json(ApiResponse.success(data, 'Marketplace analytics retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getSummaryAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.analyticsService.getSummaryAnalytics();
      res.status(200).json(ApiResponse.success(data, 'Platform summary retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  private async getFirstSupplierId(): Promise<string> {
    const { Supplier } = await import('../../models/Supplier');
    const firstSupplier = await Supplier.findOne();
    return firstSupplier ? firstSupplier._id.toString() : new (await import('mongoose')).Types.ObjectId().toString();
  }
}
