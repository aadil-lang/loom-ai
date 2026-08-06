'use client';

import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar, NavItem } from '@/components/layout/Sidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { LayoutDashboard, Store, Grid2X2, Heart, Package, ShoppingCart, Bot, User, Settings } from 'lucide-react';
import { BuyerProviders } from '@/context/BuyerProviders';
import { AuthGuard } from '@/components/auth/AuthGuard';

const buyerNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Marketplace', href: '/marketplace', icon: Store },
  { title: 'Categories', href: '/categories', icon: Grid2X2 },
  { title: 'Wishlist', href: '/wishlist', icon: Heart },
  { title: 'Orders', href: '/orders', icon: Package, badge: 2 },
  { title: 'Cart', href: '/cart', icon: ShoppingCart, badge: 4 },
  { title: 'AI Assistant', href: '/assistant', icon: Bot },
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Settings', href: '/settings', icon: Settings },
];

const mobileBottomItems: NavItem[] = [
  { title: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Market', href: '/marketplace', icon: Store },
  { title: 'Cart', href: '/cart', icon: ShoppingCart, badge: 4 },
  { title: 'Profile', href: '/profile', icon: User },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['Buyer']}>
      <BuyerProviders>
        <div className="min-h-screen flex flex-col relative bg-background">
          <Header />
          <div className="flex flex-1 pt-16">
            <Sidebar items={buyerNavItems} />
            <main className="flex-1 md:ml-64 pb-16 md:pb-0">
              <PageContainer className="p-4 md:p-8 max-w-7xl mx-auto h-full">
                {children}
              </PageContainer>
            </main>
          </div>
          <MobileBottomNav items={mobileBottomItems} />
        </div>
      </BuyerProviders>
    </AuthGuard>
  );
}
