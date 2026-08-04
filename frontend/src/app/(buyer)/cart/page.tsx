import { EmptyState } from '@/components/ui/states';

export default function CartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
      <EmptyState title="Your cart is empty" description="Browse the marketplace to find textiles." actionText="Go to Marketplace" />
    </div>
  );
}
