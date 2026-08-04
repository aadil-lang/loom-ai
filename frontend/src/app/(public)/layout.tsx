import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <Header />
      <PageContainer className="flex-1">
        {children}
      </PageContainer>
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p className="text-sm font-medium">© 2026 LoomAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
