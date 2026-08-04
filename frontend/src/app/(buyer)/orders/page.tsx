import { EmptyState } from '@/components/ui/states';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
      <EmptyState title="No orders yet" description="When you place orders, they will appear here." actionText="Start Sourcing" />
    </div>
  );
}
