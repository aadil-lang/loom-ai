/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export async function getSupplierDashboardMetrics(supplierId: string): Promise<any> {
  // Use dashboard summary for analytics
  const response = await api.get('/supplier/dashboard');
  const stats = response.data;

  // Mock monthly revenue data for charts (to preserve UI charting since backend doesn't aggregate by month yet)
  const revenueChart = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
    { name: "Aug", revenue: (stats?.orderStats?.totalRevenue || 0) / 10 },
  ];

  return {
    totalProducts: stats?.productStats?.totalProducts || 0,
    activeProducts: stats?.productStats?.activeProducts || 0,
    outOfStockProducts: stats?.productStats?.lowStockProducts || 0,
    pendingOrders: stats?.orderStats?.pendingOrders || 0,
    acceptedOrders: (stats?.orderStats?.totalOrders || 0) - (stats?.orderStats?.pendingOrders || 0),
    totalRevenue: stats?.orderStats?.totalRevenue || 0,
    revenueChart,
  };
}

export async function getSalesOverview(): Promise<any> {
  // Use dashboard summary for analytics
  const response = await api.get('/supplier/dashboard');
  return {
    labels: ['Total', 'Pending', 'Revenue'],
    datasets: [
      {
        label: 'Order Stats',
        data: [
          response.data?.orderStats?.totalOrders || 0,
          response.data?.orderStats?.pendingOrders || 0,
          response.data?.orderStats?.totalRevenue || 0
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };
}

export async function getTopProducts(): Promise<any[]> {
  // Just fetch products for now
  const response = await api.get('/supplier/products');
  return response.data?.slice(0, 5) || [];
}
