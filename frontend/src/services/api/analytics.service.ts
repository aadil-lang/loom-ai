/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export async function getBuyerDashboardMetrics(buyerId?: string): Promise<any> {
  const url = buyerId ? `/analytics/buyer?buyerId=${buyerId}` : `/analytics/buyer`;
  const response = await api.get(url);
  return response.data;
}

export async function getSupplierDashboardMetrics(supplierId?: string): Promise<any> {
  const url = supplierId ? `/analytics/supplier?supplierId=${supplierId}` : `/analytics/supplier`;
  const response = await api.get(url);
  return response.data?.data || response.data; // Depending on ApiResponse structure
}

export async function getMarketplaceMetrics(): Promise<any> {
  const response = await api.get('/analytics/marketplace');
  return response.data?.data || response.data;
}

export async function getSummaryAnalytics(): Promise<any> {
  const response = await api.get('/analytics/summary');
  return response.data?.data || response.data;
}

// Keeping legacy mocked exports for backward compatibility during transition if needed
export async function getSalesOverview(): Promise<any> {
  const data = await getSupplierDashboardMetrics();
  const summary = data?.summary || data;
  return {
    labels: ['Total', 'Pending', 'Revenue'],
    datasets: [
      {
        label: 'Order Stats',
        data: [
          summary?.totalOrders || 0,
          summary?.pendingOrders || 0,
          summary?.totalRevenue || 0
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };
}

export async function getTopProducts(): Promise<any[]> {
  const response = await api.get('/supplier/products');
  return response.data?.slice(0, 5) || [];
}
