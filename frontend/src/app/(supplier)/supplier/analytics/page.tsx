import * as React from 'react';
import { analyticsService } from '@/services';
import dynamic from 'next/dynamic';
const DashboardChart = dynamic(() => import('@/components/ui/dashboard-chart').then(m => m.DashboardChart), { ssr: false, loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" /> });
import { KpiCard } from '@/components/ui/kpi-card';
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react';

export default async function AnalyticsPage() {
  const supplierId = 's1'; 
  const metricsData = await analyticsService.getSupplierDashboardMetrics(supplierId);
  const summary = metricsData?.summary || {};
  const charts = metricsData?.charts || {};

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-6 md:p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your store performance and sales metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Gross Volume" 
          value={`₹${(summary.totalRevenue || 0).toLocaleString('en-IN')}`} 
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 18.2, label: "vs last year", isPositive: true }}
        />
        <KpiCard 
          title="Orders Completed" 
          value={(summary.completedOrders || 0).toString()} 
          icon={<ShoppingCart className="h-4 w-4" />}
          trend={{ value: 5.4, label: "vs last month", isPositive: true }}
        />
        <KpiCard 
          title="Inventory Value" 
          value={`₹${(summary.totalInventoryValue || 0).toLocaleString('en-IN')}`} 
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 0, label: "current stock", isPositive: true }}
        />
        <KpiCard 
          title="Total Products" 
          value={(summary.totalProducts || 0).toString()} 
          icon={<Users className="h-4 w-4" />}
          trend={{ value: summary.activeProducts || 0, label: "active listings", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart 
          title="Revenue Over Time" 
          description="Total sales per month"
          data={charts.revenueChart || []}
          dataKey="revenue"
          type="line"
          color="#8b5cf6" 
        />
        <DashboardChart 
          title="Top Selling Categories" 
          description="Breakdown by units sold"
          data={charts.categoryDistribution || []}
          dataKey="value"
          type="bar"
          color="#f59e0b" 
        />
      </div>
    </div>
  );
}
