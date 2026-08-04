import { WishlistRepository } from '../../repositories/WishlistRepository';
import { CartService } from './CartService';
import { IWishlist } from '../../models/Wishlist';
import mongoose from 'mongoose';

export class WishlistService {
  private wishlistRepository: WishlistRepository;
  private cartService: CartService;

  constructor() {
    this.wishlistRepository = new WishlistRepository();
    this.cartService = new CartService();
  }

  async getWishlist(buyerId: string): Promise<IWishlist> {
    return await this.wishlistRepository.findByBuyerOrCreate(buyerId);
  }

  async addProduct(buyerId: string, productId: string): Promise<IWishlist> {
    const wishlist = await this.wishlistRepository.findByBuyerOrCreate(buyerId);
    const exists = wishlist.products.some(p => p._id.toString() === productId);
    
    if (!exists) {
      wishlist.products.push(new mongoose.Types.ObjectId(productId));
      await wishlist.save();
    }
    return await this.getWishlist(buyerId);
  }

  async removeProduct(buyerId: string, productId: string): Promise<IWishlist> {
    const wishlist = await this.wishlistRepository.findByBuyerOrCreate(buyerId);
    wishlist.products = wishlist.products.filter(p => p._id.toString() !== productId);
    await wishlist.save();
    return await this.getWishlist(buyerId);
  }

  async moveToCart(buyerId: string, productId: string, quantity: number = 1): Promise<void> {
    // Try adding to cart first (might fail validation like MOQ)
    await this.cartService.addItem(buyerId, { productId, quantity });
    // If successful, remove from wishlist
    await this.removeProduct(buyerId, productId);
  }
}
