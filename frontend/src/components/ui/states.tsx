import * as React from 'react';
import { AlertCircle, Loader2, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText = 'Clear Filters',
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="flex h-[300px] w-full flex-col items-center justify-center rounded-3xl border-dashed bg-muted/30 p-8 text-center shadow-none">
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-[250px]">{description}</p>
        </div>
        {onAction && (
          <Button variant="outline" onClick={onAction} className="mt-4 rounded-full">
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an unexpected error while loading this data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="flex h-[300px] w-full flex-col items-center justify-center rounded-3xl border-destructive/20 bg-destructive/5 p-8 text-center shadow-none">
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight text-destructive">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-[300px]">{description}</p>
        </div>
        {onRetry && (
          <Button variant="destructive" onClick={onRetry} className="mt-4 rounded-full">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function LoadingState({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
}
