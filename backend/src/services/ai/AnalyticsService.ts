import { AnalyticsRepository } from '../../repositories/AnalyticsRepository';

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepository();
  }

  async getBuyerAnalytics(buyerId: string) {
    return await this.repository.getBuyerAnalytics(buyerId);
  }

  async getSupplierAnalytics(supplierId: string) {
    return await this.repository.getSupplierAnalytics(supplierId);
  }

  async getMarketplaceAnalytics() {
    return await this.repository.getMarketplaceAnalytics();
  }

  async getSummaryAnalytics() {
    return await this.repository.getSummaryAnalytics();
  }
}
