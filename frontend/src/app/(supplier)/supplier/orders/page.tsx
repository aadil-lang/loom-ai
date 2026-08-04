import { EmptyState } from '@/components/ui/states';

export default function SupplierOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500">Order Management</h1>
      <EmptyState title="No active orders" description="You don't have any pending orders to fulfill." />
    </div>
  );
}
