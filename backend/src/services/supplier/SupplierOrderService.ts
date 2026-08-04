import { OrderRepository } from '../../repositories/OrderRepository';
import { IOrder } from '../../models/Order';
import { NotFoundError, ForbiddenError, ValidationError } from '../../errors/CustomErrors';

export class SupplierOrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getOrders(supplierId: string): Promise<IOrder[]> {
    return await this.orderRepository.findSupplierOrders(supplierId);
  }

  async getOrderDetails(supplierId: string, orderId: string): Promise<IOrder> {
    const order = await this.orderRepository.findSupplierOrderDetails(orderId, supplierId);
    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

  async updateOrderStatus(supplierId: string, orderId: string, status: string): Promise<IOrder> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.supplierId.toString() !== supplierId) throw new ForbiddenError('Access denied');

    const validTransitions: Record<string, string[]> = {
      'Pending': ['Accepted', 'Rejected'],
      'Accepted': ['Preparing'],
      'Preparing': ['Ready for Dispatch'],
      'Ready for Dispatch': ['In Transit'],
      'In Transit': ['Completed'],
    };

    const allowedNextStates = validTransitions[order.status] || [];
    if (!allowedNextStates.includes(status)) {
      throw new ValidationError(`Cannot transition order from ${order.status} to ${status}`);
    }

    const updated = await this.orderRepository.update(orderId, { status } as any);
    return updated as IOrder;
  }
}
