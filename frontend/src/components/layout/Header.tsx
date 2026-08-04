'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
  className?: string;
  isSupplier?: boolean;
}

export function Header({ showSidebarToggle, onSidebarToggle, className, isSupplier = false }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md", className)}>
      <div className="flex h-16 items-center px-4 gap-4 md:px-6">
        
        {/* Mobile Sidebar Toggle (for Supplier Drawer or general mobile menu) */}
        {showSidebarToggle && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onSidebarToggle}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}

        {/* Brand */}
        <Link href={isSupplier ? "/supplier" : "/"} className="flex items-center gap-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold",
            isSupplier ? "bg-emerald-600" : "bg-primary"
          )}>
            L
          </div>
          <span className="hidden font-bold tracking-tight md:inline-block text-xl">
            LoomAI <span className={cn("text-xs align-top font-medium px-1 rounded-sm", isSupplier ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" : "text-primary bg-primary/10")}>{isSupplier ? "Supplier" : "B2B"}</span>
          </span>
        </Link>

        {/* Search Bar (Hidden on tiny mobile screens, expands on tablet+) */}
        <div className="flex-1 flex justify-center md:justify-start md:ml-6 max-w-2xl">
          <div className="hidden sm:block w-full">
            <SearchBar />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Guest User</p>
                  <p className="text-xs leading-none text-muted-foreground">guest@loomai.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={isSupplier ? "/supplier" : "/dashboard"} className="w-full">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={isSupplier ? "/supplier/orders" : "/orders"} className="w-full">Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
