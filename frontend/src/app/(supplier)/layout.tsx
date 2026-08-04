'use client';

import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar, NavItem } from '@/components/layout/Sidebar';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { PageContainer } from '@/components/layout/PageContainer';
import { LayoutDashboard, Box, Package, BarChart3, Users, Bot, User, Settings } from 'lucide-react';

const supplierNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/supplier', icon: LayoutDashboard },
  { title: 'Inventory', href: '/supplier/inventory', icon: Box },
  { title: 'Orders', href: '/supplier/orders', icon: Package, badge: 5 },
  { title: 'Analytics', href: '/supplier/analytics', icon: BarChart3 },
  { title: 'Customers', href: '/supplier/customers', icon: Users },
  { title: 'AI Assistant', href: '/supplier/assistant', icon: Bot },
  { title: 'Profile', href: '/supplier/profile', icon: User },
  { title: 'Settings', href: '/supplier/settings', icon: Settings },
];

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <Header 
        isSupplier 
        showSidebarToggle 
        onSidebarToggle={() => setMobileMenuOpen(true)} 
      />
      
      <MobileDrawer 
        isSupplier
        open={mobileMenuOpen} 
        onOpenChange={setMobileMenuOpen} 
        items={supplierNavItems} 
      />

      <div className="flex flex-1 pt-16">
        <Sidebar items={supplierNavItems} isSupplier />
        <main className="flex-1 md:ml-64">
          <PageContainer className="p-4 md:p-8 max-w-7xl mx-auto h-full">
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
