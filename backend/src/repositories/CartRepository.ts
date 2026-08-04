import { Cart, ICart } from '../models/Cart';
import { BaseRepository } from './BaseRepository';

export class CartRepository extends BaseRepository<ICart> {
  constructor() {
    super(Cart);
  }

  async findByBuyer(buyerId: string): Promise<ICart | null> {
    return await this.model.findOne({ buyerId }).populate('items.productId').exec();
  }

  async findByBuyerOrCreate(buyerId: string): Promise<ICart> {
    let cart = await this.findByBuyer(buyerId);
    if (!cart) {
      cart = await this.model.create({ buyerId, items: [] });
    }
    return cart;
  }

  async clearCart(buyerId: string): Promise<void> {
    await this.model.updateOne({ buyerId }, { $set: { items: [] } }).exec();
  }
}
