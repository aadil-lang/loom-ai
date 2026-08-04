import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          The Future of B2B Textile Sourcing
        </h1>
        <p className="text-xl text-muted-foreground">
          Connect directly with verified mills, instantly translate negotiations, and streamline your supply chain with LoomAI.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/marketplace">
          <Button size="lg" className="rounded-full px-8 text-lg">
            Explore Marketplace
          </Button>
        </Link>
        <Link href="/supplier">
          <Button size="lg" variant="outline" className="rounded-full px-8 text-lg">
            Supplier Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
