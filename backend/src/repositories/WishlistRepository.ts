import { Wishlist, IWishlist } from '../models/Wishlist';
import { BaseRepository } from './BaseRepository';

export class WishlistRepository extends BaseRepository<IWishlist> {
  constructor() {
    super(Wishlist);
  }

  async findByBuyer(buyerId: string): Promise<IWishlist | null> {
    return await this.model.findOne({ buyerId }).populate('products').exec();
  }

  async findByBuyerOrCreate(buyerId: string): Promise<IWishlist> {
    let wishlist = await this.findByBuyer(buyerId);
    if (!wishlist) {
      wishlist = await this.model.create({ buyerId, products: [] });
    }
    return wishlist;
  }
}
