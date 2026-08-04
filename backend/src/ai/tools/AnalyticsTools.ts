import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { DashboardService } from '../../services/supplier/DashboardService';
// In a real scenario we'd import OrderService or BuyerService for buyers too

export class AnalyticsTools {
  private dashboardService = new DashboardService();

  public getSupplierMetricsTool() {
    return new DynamicStructuredTool({
      name: 'get_supplier_metrics',
      description: 'Fetch historical dashboard metrics for a supplier.',
      schema: z.object({
        supplierId: z.string().describe('The ID of the supplier')
      }),
      func: async ({ supplierId }) => {
        try {
          const metrics = await this.dashboardService.getDashboardSummary(supplierId);
          return JSON.stringify(metrics);
        } catch (error: any) {
          return `Error fetching supplier metrics: ${error.message}`;
        }
      }
    });
  }

  public getBuyerMetricsTool() {
    return new DynamicStructuredTool({
      name: 'get_buyer_metrics',
      description: 'Fetch historical procurement metrics for a buyer.',
      schema: z.object({
        buyerId: z.string().describe('The ID of the buyer')
      }),
      func: async ({ buyerId }) => {
        // Mocking buyer metrics for the sake of the advisor
        const mockMetrics = {
          totalOrders: 14,
          totalSpent: 45000,
          mostPurchasedCategory: 'Denim',
          averageOrderValue: 3214,
          frequentSuppliers: ['Supplier_A', 'Supplier_B']
        };
        return JSON.stringify(mockMetrics);
      }
    });
  }

  public getInventoryForecastTool() {
    return new DynamicStructuredTool({
      name: 'forecast_inventory',
      description: 'Predict when inventory will run out based on sales velocity heuristics.',
      schema: z.object({
        productId: z.string().describe('The ID of the product')
      }),
      func: async ({ productId }) => {
        // Mocking a predictive heuristic
        return JSON.stringify({
          productId,
          currentStock: 120,
          salesVelocityPerDay: 5.4,
          daysToDepletion: Math.floor(120 / 5.4),
          recommendedRestockDate: '2026-08-20'
        });
      }
    });
  }
}
