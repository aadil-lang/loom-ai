import { getProductsBySupplier } from './product.service';
import { getOrdersBySupplier } from './order.service';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getSupplierDashboardMetrics(supplierId: string) {
  const products = await getProductsBySupplier(supplierId);
  const orders = await getOrdersBySupplier(supplierId);

  const activeProducts = products.filter((p: any) => p.status === "Active").length;
  const outOfStockProducts = products.filter((p: any) => p.stock < 100).length;
  
  const pendingOrders = orders.filter((o: any) => o.status === "Pending").length;
  const acceptedOrders = orders.filter((o: any) => o.status === "Accepted" || o.status === "Preparing").length;
  
  const totalRevenue = orders.reduce((acc: number, o: any) => acc + o.totalValue, 0);

  // Mock monthly revenue data for charts
  const revenueChart = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
    { name: "Aug", revenue: totalRevenue / 10 }, // fake tie-in
  ];

  return {
    totalProducts: products.length,
    activeProducts,
    outOfStockProducts,
    pendingOrders,
    acceptedOrders,
    totalRevenue,
    revenueChart,
  };
}
