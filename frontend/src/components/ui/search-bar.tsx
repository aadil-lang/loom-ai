'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full max-w-md", className)}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          placeholder="Search for textiles, suppliers, AI requests..."
          className="pl-10 pr-12 rounded-full border-border/50 bg-muted/50 focus-visible:ring-primary shadow-sm"
          {...props}
        />
        <div className="absolute right-3 hidden sm:flex items-center space-x-1">
          <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';
