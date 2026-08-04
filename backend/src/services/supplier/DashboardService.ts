import { ProductRepository } from '../../repositories/ProductRepository';
import { OrderRepository } from '../../repositories/OrderRepository';

export class DashboardService {
  private productRepository: ProductRepository;
  private orderRepository: OrderRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.orderRepository = new OrderRepository();
  }

  async getDashboardSummary(supplierId: string) {
    const [productStats, orderStats] = await Promise.all([
      this.productRepository.aggregateDashboardStats(supplierId),
      this.orderRepository.aggregateSupplierDashboardStats(supplierId)
    ]);

    return {
      productStats,
      orderStats
    };
  }
}
