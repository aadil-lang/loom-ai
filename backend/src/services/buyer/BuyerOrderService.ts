import { OrderRepository } from '../../repositories/OrderRepository';
import { IOrder } from '../../models/Order';
import { NotFoundError, ForbiddenError } from '../../errors/CustomErrors';

export class BuyerOrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getOrderHistory(buyerId: string): Promise<IOrder[]> {
    return await this.orderRepository.findByBuyer(buyerId);
  }

  async getOrderDetails(buyerId: string, orderId: string): Promise<IOrder> {
    const order = await this.orderRepository.findOrderDetails(orderId, buyerId);
    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

  async cancelOrder(buyerId: string, orderId: string): Promise<IOrder> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.buyerId.toString() !== buyerId) throw new ForbiddenError('Access denied to this order');
    
    // Business logic: Only Pending orders can be cancelled directly by buyer
    if (order.status !== 'Pending') {
      throw new ForbiddenError('Order cannot be cancelled at this stage');
    }

    const updated = await this.orderRepository.update(orderId, { status: 'Cancelled' });
    return updated as IOrder;
  }
}
