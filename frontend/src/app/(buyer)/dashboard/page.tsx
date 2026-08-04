import * as React from 'react';
import { KpiCard } from '@/components/ui/kpi-card';
import { DashboardChart } from '@/components/ui/dashboard-chart';
import { RecommendationSection } from '@/components/buyer/RecommendationSection';
import { Package, Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { buyerService, productService, orderService } from '@/services';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function DashboardPage() {
  const [profile, orders, recommendedProducts] = await Promise.all([
    buyerService.getBuyerProfile(),
    buyerService.getBuyerOrders(),
    productService.getProducts() // We'll just slice some for mock recommendations
  ]);

  const activeOrders = orders.filter((o: any) => o.status !== 'Completed').length;
  
  // Mock monthly spending chart
  const spendingChart = [
    { name: "Jan", value: 12500 },
    { name: "Feb", value: 18200 },
    { name: "Mar", value: 15400 },
    { name: "Apr", value: 22100 },
    { name: "May", value: 31000 },
    { name: "Jun", value: 28400 },
  ];

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile.contactName}</h1>
        <p className="text-muted-foreground mt-1">Here is an overview of {profile.name}'s sourcing activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Orders" 
          value={orders.length.toString()} 
          icon={<Package className="h-4 w-4" />}
          trend={{ value: 12, label: "this quarter", isPositive: true }}
        />
        <KpiCard 
          title="Active Orders" 
          value={activeOrders.toString()} 
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <KpiCard 
          title="Wishlist Items" 
          value="14" 
          icon={<Heart className="h-4 w-4" />}
        />
        <KpiCard 
          title="Saved Suppliers" 
          value="3" 
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <DashboardChart 
            title="Monthly Spending (Mock)" 
            description="Your procurement spend over the last 6 months"
            data={spendingChart}
            dataKey="value"
            type="bar"
            color="#2563eb" 
          />

          <RecommendationSection products={recommendedProducts.slice(0, 4)} />
        </div>

        <div className="space-y-8">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pb-2">
              <h3 className="font-semibold leading-none tracking-tight">Recent Orders</h3>
              <p className="text-sm text-muted-foreground mt-1">Your latest procurement activity.</p>
            </div>
            <div className="p-6 space-y-4">
              {orders.slice(0, 4).map((order: any) => (
                <div key={order.id} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-sm">{order.id}</div>
                    <div className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">${order.totalValue.toLocaleString()}</div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
              <Link href="/orders" className="block mt-4">
                <Button variant="outline" className="w-full text-blue-600">
                  View All Orders <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pb-2">
              <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <Link href="/marketplace">
                <Button className="w-full justify-start" variant="secondary">Browse Categories</Button>
              </Link>
              <Link href="/wishlist">
                <Button className="w-full justify-start" variant="secondary">View Wishlist</Button>
              </Link>
              <Link href="/suppliers">
                <Button className="w-full justify-start" variant="secondary">Saved Suppliers</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
