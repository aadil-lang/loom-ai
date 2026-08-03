import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertTriangle, Package, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OrderStatusBadge({ status }: { status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }) {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200 dark:border-yellow-900',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 border-blue-200 dark:border-blue-900',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500 border-indigo-200 dark:border-indigo-900',
    delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500 border-emerald-200 dark:border-emerald-900',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const icons = {
    pending: Clock,
    processing: Package,
    shipped: Package,
    delivered: CheckCircle2,
    cancelled: AlertTriangle,
  };

  const Icon = icons[status];

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium capitalize", variants[status])}>
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

export function PriceBadge({ price, currency = '₹' }: { price: number; currency?: string }) {
  return (
    <Badge variant="secondary" className="gap-1 bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground font-semibold px-2 py-0.5 rounded-md">
      <DollarSign className="h-3 w-3 hidden" />
      <span>{currency}{price.toLocaleString()}</span>
    </Badge>
  );
}

export function StockBadge({ count }: { count: number }) {
  const isLow = count > 0 && count < 50;
  const isOut = count === 0;

  return (
    <Badge 
      variant={isOut ? "destructive" : "outline"} 
      className={cn(
        "font-medium",
        !isOut && !isLow && "bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50",
        isLow && "bg-yellow-100/50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50"
      )}
    >
      {isOut ? 'Out of Stock' : isLow ? `Low Stock (${count})` : `In Stock (${count})`}
    </Badge>
  );
}

export function MOQBadge({ amount, unit = 'm' }: { amount: number; unit?: string }) {
  return (
    <Badge variant="outline" className="bg-muted/50 text-muted-foreground font-medium border-border/50">
      MOQ: {amount} {unit}
    </Badge>
  );
}
