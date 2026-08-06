"use client"

import * as React from 'react';
import { getOrders } from '@/services/api/order.service';
import { Activity } from 'lucide-react';
import Link from 'next/link';

export const RecentOrdersClient = React.memo(function RecentOrdersClient() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getOrders();
        // Just take top 5
        setOrders((Array.isArray(data) ? data : (data as any)?.data || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to load recent orders", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Loading recent orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Activity className="h-12 w-12 text-slate-200 mb-4" />
        <h3 className="text-lg font-semibold tracking-tight text-slate-700">No Recent Orders</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-[250px] text-center">
          When buyers place orders for your products, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id || order._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors">
          <div>
            <div className="font-medium text-blue-600">
              <Link href={`/supplier/orders/${order.id || order._id}`}>
                {order.id || order._id}
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">{new Date(order.createdAt || order.date).toLocaleDateString()}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold" suppressHydrationWarning>₹{(order.totalValue || 0).toLocaleString('en-IN')}</div>
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{order.status}</div>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <Link href="/supplier/orders" className="text-sm text-blue-600 hover:underline">
          View all orders
        </Link>
      </div>
    </div>
  );
});
