import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">LoomAI</h3>
            <p className="text-sm text-muted-foreground">
              The premier B2B marketplace for sourcing premium Indian textiles, connecting global buyers with verified manufacturers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/marketplace" className="hover:text-primary transition-colors">Browse Fabrics</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/suppliers" className="hover:text-primary transition-colors">Verified Suppliers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/knowledge" className="hover:text-primary transition-colors">Knowledge Center</Link></li>
              <li><Link href="/knowledge/certifications" className="hover:text-primary transition-colors">Textile Certifications</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">Support & FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/auth/register" className="hover:text-primary transition-colors">Become a Supplier</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LoomAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
