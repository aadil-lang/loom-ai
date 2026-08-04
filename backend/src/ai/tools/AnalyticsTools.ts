import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { DashboardService } from '../../services/supplier/DashboardService';

export class AnalyticsTools {
  private dashboardService = new DashboardService();

  public getDashboardMetricsTool() {
    return new DynamicStructuredTool({
      name: 'get_dashboard_metrics',
      description: 'Retrieve aggregated metrics for a supplier including total products, active products, pending orders, and total revenue.',
      schema: z.object({
        supplierId: z.string().describe('The ID of the supplier'),
      }),
      func: async ({ supplierId }) => {
        try {
          const stats = await this.dashboardService.getDashboardSummary(supplierId);
          return JSON.stringify(stats);
        } catch (error: any) {
          return `Error retrieving dashboard metrics: ${error.message}`;
        }
      }
    });
  }
}
