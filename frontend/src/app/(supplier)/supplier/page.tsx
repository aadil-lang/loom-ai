import * as React from 'react';
import { KpiCard } from '@/components/ui/kpi-card';
import dynamic from 'next/dynamic';
const DashboardChart = dynamic(() => import('@/components/ui/dashboard-chart').then(m => m.DashboardChart), { ssr: false, loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" /> });
import { analyticsService } from '@/services';
import { Package, ShoppingBag, AlertCircle, DollarSign, Activity, Star } from 'lucide-react';
import { RecentOrdersClient } from '@/components/supplier/RecentOrdersClient';
import { StoreRatingClient } from '@/components/supplier/StoreRatingClient';

export default async function SupplierDashboardPage() {
  // Hardcoded supplier ID for the mock context
  const supplierId = 's1'; 
  const metricsData = await analyticsService.getSupplierDashboardMetrics(supplierId);
  const summary = metricsData?.summary || {};
  const charts = metricsData?.charts || {};

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your supplier metrics and recent activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Revenue" 
          value={`₹${(summary.totalRevenue || 0).toLocaleString('en-IN')}`} 
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 12.5, label: "from last month", isPositive: true }}
        />
        <KpiCard 
          title="Pending Orders" 
          value={(summary.pendingOrders || 0).toString()} 
          icon={<ShoppingBag className="h-4 w-4" />}
          description="Needs your attention"
        />
        <KpiCard 
          title="Active Products" 
          value={(summary.activeProducts || 0).toString()} 
          icon={<Package className="h-4 w-4" />}
          trend={{ value: 2.4, label: "from last week", isPositive: true }}
        />
        <KpiCard 
          title="Low Stock Alerts" 
          value={(summary.outOfStock || 0).toString()} 
          icon={<AlertCircle className="h-4 w-4" />}
          className={(summary.outOfStock || 0) > 0 ? "border-amber-500/50" : ""}
          description="Products below 100 qty"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart 
            title="Revenue Overview" 
            description="Monthly revenue for the current year"
            data={charts.revenueChart || []}
            dataKey="revenue"
            type="line"
            color="#10b981" // emerald-500
          />
        </div>
        <div className="lg:col-span-1">
          <DashboardChart 
            title="Orders by Category" 
            description="Distribution of orders"
            data={charts.categoryDistribution || []}
            dataKey="value"
            type="bar"
            color="#3b82f6" // blue-500
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between space-y-0 pb-4 border-b mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Recent Orders</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <RecentOrdersClient />
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between space-y-0 pb-4 border-b mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Store Rating & Reviews</h3>
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>
          <StoreRatingClient />
        </div>
      </div>
    </div>
  );
}
