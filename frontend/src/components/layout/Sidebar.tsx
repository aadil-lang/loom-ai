'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  variant?: 'default' | 'ghost';
  badge?: number;
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[];
  isSupplier?: boolean;
}

export function Sidebar({ className, items, isSupplier = false, ...props }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("hidden md:flex flex-col border-r bg-muted/20 h-screen w-64 fixed left-0 top-16", className)} {...props}>
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-4 text-sm font-medium gap-1.5">
          {items.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link key={index} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-accent hover:text-accent-foreground",
                    isActive 
                      ? (isSupplier ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100" : "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                  {item.badge && (
                    <span className={cn(
                      "ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                      isActive 
                        ? (isSupplier ? "bg-emerald-200 text-emerald-900 dark:bg-emerald-800" : "bg-primary-foreground/20 text-primary-foreground") 
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
      <div className="p-4 border-t border-border/50">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-sm">
          <p className="font-semibold text-primary mb-1">LoomAI Pro</p>
          <p className="text-muted-foreground text-xs mb-3">Get advanced AI analytics and unlimited matching.</p>
          <Button size="sm" className="w-full text-xs rounded-full">Upgrade</Button>
        </div>
      </div>
    </div>
  );
}
