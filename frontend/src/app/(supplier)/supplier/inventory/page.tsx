import { EmptyState } from '@/components/ui/states';

export default function SupplierInventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500">Inventory Management</h1>
      <EmptyState title="No products listed" description="Start adding your textile products to the marketplace." actionText="Add Product" />
    </div>
  );
}
