import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Footer } from '@/components/layout/Footer';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <Header />
      <PageContainer className="flex-1 w-full max-w-none p-0">
        {children}
      </PageContainer>
      <Footer />
    </div>
  );
}
