import { Order, IOrder } from '../models/Order';
import { BaseRepository } from './BaseRepository';
import mongoose from 'mongoose';

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

  async findSupplierOrders(supplierId: string): Promise<IOrder[]> {
    return await this.model.find({ supplierId }).sort({ createdAt: -1 }).populate('buyerId', 'name email').exec();
  }

  async findSupplierOrderDetails(orderId: string, supplierId: string): Promise<IOrder | null> {
    return await this.model.findOne({ _id: orderId, supplierId })
      .populate('items.productId', 'name sku pricePerMeter images')
      .populate('buyerId', 'name email contactName')
      .exec();
  }

  async aggregateSupplierDashboardStats(supplierId: string) {
    const objectId = new mongoose.Types.ObjectId(supplierId);
    const result = await this.model.aggregate([
      { $match: { supplierId: objectId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, '$totalValue', 0] }
          }
        }
      }
    ]);
    return result[0] || { totalOrders: 0, pendingOrders: 0, totalRevenue: 0 };
  }
}
