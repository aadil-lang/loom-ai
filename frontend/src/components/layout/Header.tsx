'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, Menu, User, ShoppingCart, Sparkles } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { useAuth } from '@/context/AuthContext';
import { useAI } from '@/context/AIContext';

interface HeaderProps {
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
  className?: string;
  isSupplier?: boolean;
}

export function Header({ showSidebarToggle, onSidebarToggle, className, isSupplier = false }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleAI } = useAI();
  
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

        {/* Global Links (Hidden on small screens) */}
        <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium">
          <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">Marketplace</Link>
          <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
          <Link href="/knowledge" className="text-muted-foreground hover:text-foreground transition-colors">Knowledge Center</Link>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center md:justify-end md:mx-6 max-w-xl">
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

          <Button variant="ghost" size="icon" className="relative rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30" onClick={toggleAI}>
            <Sparkles className="h-5 w-5" />
            <span className="sr-only">Ask AI</span>
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "relative h-9 w-9 rounded-full px-0")}>
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={user?.role === 'Supplier' ? "/supplier" : "/dashboard"} className="w-full cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={user?.role === 'Supplier' ? "/supplier/orders" : "/orders"} className="w-full cursor-pointer">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="font-semibold">Log in</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="font-semibold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
