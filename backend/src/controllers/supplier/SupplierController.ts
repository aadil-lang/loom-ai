import { Request, Response, NextFunction } from 'express';
import { SupplierProfileService } from '../../services/supplier/SupplierProfileService';
import { SupplierProductService } from '../../services/supplier/SupplierProductService';
import { InventoryService } from '../../services/supplier/InventoryService';
import { SupplierOrderService } from '../../services/supplier/SupplierOrderService';
import { DashboardService } from '../../services/supplier/DashboardService';
import { ApiResponse } from '../../responses/ApiResponse';

export class SupplierController {
  private profileService = new SupplierProfileService();
  private productService = new SupplierProductService();
  private inventoryService = new InventoryService();
  private orderService = new SupplierOrderService();
  private dashboardService = new DashboardService();

  // --- Profile ---
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.profileService.getProfile(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Profile retrieved'));
    } catch (error) { next(error); }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.profileService.updateProfile(req.user!.id, req.body);
      res.status(200).json(ApiResponse.success(result, 'Profile updated'));
    } catch (error) { next(error); }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.profileService.updateSettings(req.user!.id, req.body);
      res.status(200).json(ApiResponse.success(result, 'Settings updated'));
    } catch (error) { next(error); }
  };

  // --- Products ---
  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.getProducts(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Products retrieved'));
    } catch (error) { next(error); }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.createProduct(req.user!.id, req.body);
      res.status(201).json(ApiResponse.success(result, 'Product created'));
    } catch (error) { next(error); }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.updateProduct(req.user!.id, req.params.id as string, req.body);
      res.status(200).json(ApiResponse.success(result, 'Product updated'));
    } catch (error) { next(error); }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.deleteProduct(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(null, 'Product deleted'));
    } catch (error) { next(error); }
  };

  reorderImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.reorderImages(req.user!.id, req.params.id as string, req.body);
      res.status(200).json(ApiResponse.success(result, 'Images reordered'));
    } catch (error) { next(error); }
  };

  // --- Inventory ---
  updateInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.inventoryService.updateInventory(req.user!.id, req.params.productId as string, req.body);
      res.status(200).json(ApiResponse.success(result, 'Inventory updated'));
    } catch (error) { next(error); }
  };

  bulkUpdateInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.inventoryService.bulkUpdateInventory(req.user!.id, req.body);
      res.status(200).json(ApiResponse.success(result, 'Bulk inventory updated'));
    } catch (error) { next(error); }
  };

  // --- Orders ---
  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.orderService.getOrders(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Orders retrieved'));
    } catch (error) { next(error); }
  };

  getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.orderService.getOrderDetails(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Order details retrieved'));
    } catch (error) { next(error); }
  };

  updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.orderService.updateOrderStatus(req.user!.id, req.params.id as string, req.body.status);
      res.status(200).json(ApiResponse.success(result, 'Order status updated'));
    } catch (error) { next(error); }
  };

  // --- Dashboard ---
  getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.dashboardService.getDashboardSummary(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Dashboard summary retrieved'));
    } catch (error) { next(error); }
  };
}
