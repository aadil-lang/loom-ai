import { Order } from '../models/Order';
import { BaseRepository } from '../repositories/BaseRepository';

// Internal Order Repository definition within service for brevity in this sprint,
// ideally split into its own file like ProductRepository.
class OrderRepository extends BaseRepository<any> {
  constructor() {
    super(Order);
  }
  
  async getByBuyer(buyerId: string) {
    return await this.model.find({ buyerId }).exec();
  }
}

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getOrderAnalytics(supplierId: string) {
    // AI Agents can consume this for insights
    const orders = await this.orderRepository.findAll({ supplierId });
    return {
      totalOrders: orders.length,
      revenue: orders.reduce((sum, order) => sum + order.totalValue, 0),
    };
  }
}
