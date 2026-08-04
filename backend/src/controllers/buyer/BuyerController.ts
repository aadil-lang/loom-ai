import { Request, Response, NextFunction } from 'express';
import { BuyerProfileService } from '../../services/buyer/BuyerProfileService';
import { AddressService } from '../../services/buyer/AddressService';
import { CartService } from '../../services/buyer/CartService';
import { WishlistService } from '../../services/buyer/WishlistService';
import { CheckoutService } from '../../services/buyer/CheckoutService';
import { BuyerOrderService } from '../../services/buyer/BuyerOrderService';
import { BuyerNotificationService } from '../../services/buyer/BuyerNotificationService';
import { ApiResponse } from '../../responses/ApiResponse';

export class BuyerController {
  private profileService = new BuyerProfileService();
  private addressService = new AddressService();
  private cartService = new CartService();
  private wishlistService = new WishlistService();
  private checkoutService = new CheckoutService();
  private orderService = new BuyerOrderService();
  private notificationService = new BuyerNotificationService();

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

  // --- Addresses ---
  getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.addressService.getAddresses(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Addresses retrieved'));
    } catch (error) { next(error); }
  };

  createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.addressService.createAddress(req.user!.id, req.body);
      res.status(201).json(ApiResponse.success(result, 'Address created'));
    } catch (error) { next(error); }
  };

  updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.addressService.updateAddress(req.user!.id, req.params.id as string, req.body);
      res.status(200).json(ApiResponse.success(result, 'Address updated'));
    } catch (error) { next(error); }
  };

  deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.addressService.deleteAddress(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(null, 'Address deleted'));
    } catch (error) { next(error); }
  };

  // --- Cart ---
  getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.cartService.getCart(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Cart retrieved'));
    } catch (error) { next(error); }
  };

  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.cartService.addItem(req.user!.id, req.body);
      res.status(200).json(ApiResponse.success(result, 'Item added to cart'));
    } catch (error) { next(error); }
  };

  updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.cartService.updateItemQuantity(req.user!.id, req.params.id as string, req.body);
      res.status(200).json(ApiResponse.success(result, 'Cart item updated'));
    } catch (error) { next(error); }
  };

  removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.cartService.removeItem(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Cart item removed'));
    } catch (error) { next(error); }
  };

  clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.cartService.clearCart(req.user!.id);
      res.status(200).json(ApiResponse.success(null, 'Cart cleared'));
    } catch (error) { next(error); }
  };

  // --- Wishlist ---
  getWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.wishlistService.getWishlist(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Wishlist retrieved'));
    } catch (error) { next(error); }
  };

  addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.wishlistService.addProduct(req.user!.id, req.body.productId);
      res.status(200).json(ApiResponse.success(result, 'Item added to wishlist'));
    } catch (error) { next(error); }
  };

  removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.wishlistService.removeProduct(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Item removed from wishlist'));
    } catch (error) { next(error); }
  };

  moveToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.wishlistService.moveToCart(req.user!.id, req.params.id as string, 1);
      res.status(200).json(ApiResponse.success(null, 'Item moved to cart'));
    } catch (error) { next(error); }
  };

  // --- Checkout ---
  checkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.checkoutService.processCheckout(req.user!.id, req.body);
      res.status(201).json(ApiResponse.success(result, 'Checkout successful, orders created'));
    } catch (error) { next(error); }
  };

  // --- Orders ---
  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.orderService.getOrderHistory(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Orders retrieved'));
    } catch (error) { next(error); }
  };

  getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.orderService.getOrderDetails(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Order details retrieved'));
    } catch (error) { next(error); }
  };

  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.orderService.cancelOrder(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Order cancelled'));
    } catch (error) { next(error); }
  };

  // --- Notifications ---
  getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.notificationService.getNotifications(req.user!.id);
      res.status(200).json(ApiResponse.success(result, 'Notifications retrieved'));
    } catch (error) { next(error); }
  };

  markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.notificationService.markAsRead(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(result, 'Notification marked as read'));
    } catch (error) { next(error); }
  };

  markAllNotificationsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.notificationService.markAllAsRead(req.user!.id);
      res.status(200).json(ApiResponse.success(null, 'All notifications marked as read'));
    } catch (error) { next(error); }
  };

  deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.notificationService.deleteNotification(req.user!.id, req.params.id as string);
      res.status(200).json(ApiResponse.success(null, 'Notification deleted'));
    } catch (error) { next(error); }
  };
}
