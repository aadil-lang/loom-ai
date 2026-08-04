import * as React from 'react';
import { analyticsService } from '@/services';
import { DashboardChart } from '@/components/ui/dashboard-chart';
import { KpiCard } from '@/components/ui/kpi-card';
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react';

export default async function AnalyticsPage() {
  const supplierId = 's1'; 
  const metrics = await analyticsService.getSupplierDashboardMetrics(supplierId);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-6 md:p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your store performance and sales metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Gross Volume" 
          value={`$${metrics.totalRevenue.toLocaleString()}`} 
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 18.2, label: "vs last year", isPositive: true }}
        />
        <KpiCard 
          title="Orders Completed" 
          value={metrics.acceptedOrders.toString()} 
          icon={<ShoppingCart className="h-4 w-4" />}
          trend={{ value: 5.4, label: "vs last month", isPositive: true }}
        />
        <KpiCard 
          title="Conversion Rate" 
          value="3.2%" 
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 1.1, label: "vs last month", isPositive: false }}
        />
        <KpiCard 
          title="Unique Buyers" 
          value="142" 
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 12, label: "new buyers this week", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart 
          title="Revenue Over Time" 
          description="Total sales per month"
          data={metrics.revenueChart}
          dataKey="revenue"
          type="line"
          color="#8b5cf6" 
        />
        <DashboardChart 
          title="Top Selling Categories" 
          description="Breakdown by units sold"
          data={[
            { name: "Cotton", value: 1200 },
            { name: "Silk", value: 850 },
            { name: "Linen", value: 430 },
            { name: "Polyester", value: 900 }
          ]}
          dataKey="value"
          type="bar"
          color="#f59e0b" 
        />
      </div>
    </div>
  );
}
