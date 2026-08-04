import * as React from 'react';
import { KpiCard } from '@/components/ui/kpi-card';
import { DashboardChart } from '@/components/ui/dashboard-chart';
import { analyticsService } from '@/services';
import { Package, ShoppingBag, AlertCircle, DollarSign, Activity } from 'lucide-react';

export default async function SupplierDashboardPage() {
  // Hardcoded supplier ID for the mock context
  const supplierId = 's1'; 
  const metrics = await analyticsService.getSupplierDashboardMetrics(supplierId);

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
          value={`$${metrics.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 12.5, label: "from last month", isPositive: true }}
        />
        <KpiCard 
          title="Pending Orders" 
          value={metrics.pendingOrders.toString()} 
          icon={<ShoppingBag className="h-4 w-4" />}
          description="Needs your attention"
        />
        <KpiCard 
          title="Active Products" 
          value={metrics.activeProducts.toString()} 
          icon={<Package className="h-4 w-4" />}
          trend={{ value: 2.4, label: "from last week", isPositive: true }}
        />
        <KpiCard 
          title="Low Stock Alerts" 
          value={metrics.outOfStockProducts.toString()} 
          icon={<AlertCircle className="h-4 w-4" />}
          className={metrics.outOfStockProducts > 0 ? "border-amber-500/50" : ""}
          description="Products below 100 qty"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart 
            title="Revenue Overview" 
            description="Monthly revenue for the current year"
            data={metrics.revenueChart}
            dataKey="revenue"
            type="line"
            color="#10b981" // emerald-500
          />
        </div>
        <div className="lg:col-span-1">
          <DashboardChart 
            title="Orders by Category" 
            description="Distribution of orders"
            data={[
              { name: "Cotton", value: 400 },
              { name: "Silk", value: 300 },
              { name: "Denim", value: 300 },
              { name: "Linen", value: 200 }
            ]}
            dataKey="value"
            type="bar"
            color="#3b82f6" // blue-500
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Recent Orders list */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between space-y-0 pb-4 border-b">
            <h3 className="text-lg font-semibold tracking-tight">Recent Orders</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="py-8 text-center text-muted-foreground text-sm">
            Recent orders will appear here. (Coming in Phase 4)
          </div>
        </div>
      </div>
    </div>
  );
}
