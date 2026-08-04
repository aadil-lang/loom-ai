'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { NavItem } from './Sidebar';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: NavItem[];
  isSupplier?: boolean;
}

export function MobileDrawer({ open, onOpenChange, items, isSupplier = false }: MobileDrawerProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 border-r border-border bg-background">
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>
        <div className="flex h-16 items-center px-6 border-b">
          <Link 
            href={isSupplier ? "/supplier" : "/"} 
            className="flex items-center gap-2"
            onClick={() => onOpenChange(false)}
          >
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold",
              isSupplier ? "bg-emerald-600" : "bg-primary"
            )}>
              L
            </div>
            <span className="font-bold tracking-tight text-xl">LoomAI</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-4 text-sm font-medium gap-2">
            {items.map((item, index) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <Link 
                  key={index} 
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                >
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
                      isActive 
                        ? (isSupplier ? "bg-emerald-100 text-emerald-900" : "bg-primary text-primary-foreground")
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        "ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                        isActive 
                          ? (isSupplier ? "bg-emerald-200 text-emerald-900" : "bg-primary-foreground/20 text-primary-foreground") 
                          : "bg-muted-foreground/20 text-muted-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
