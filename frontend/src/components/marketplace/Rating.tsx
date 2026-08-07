'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({
  value,
  max = 5,
  readOnly = true,
  onChange,
  className,
  size = 'sm',
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  };

  const handleMouseEnter = (index: number) => {
    if (!readOnly) setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (!readOnly && onChange) onChange(index);
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = (hoverValue ?? value) >= starValue;
        
        return (
          <Star
            key={`star-${i}`}
            className={cn(
              sizes[size],
              "transition-colors",
              isFilled ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-muted-foreground/30",
              !readOnly && "cursor-pointer hover:scale-110 active:scale-95 transition-transform"
            )}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
}
