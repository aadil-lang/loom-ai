import { Order, IOrder } from '../models/Order';
import { BaseRepository } from './BaseRepository';

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(Order);
  }

  async findByBuyer(buyerId: string): Promise<IOrder[]> {
    return await this.model.find({ buyerId }).sort({ createdAt: -1 }).populate('supplierId', 'name').exec();
  }

  async findOrderDetails(orderId: string, buyerId: string): Promise<IOrder | null> {
    return await this.model.findOne({ _id: orderId, buyerId })
      .populate('items.productId', 'name sku pricePerMeter images')
      .populate('supplierId', 'name email contactName')
      .exec();
  }
}
