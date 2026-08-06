import * as React from 'react';
import { productService } from '@/services';
import { WishlistClient } from '@/components/buyer/WishlistClient';

export default async function WishlistPage() {
  const allProducts = await productService.getProducts();

  return <WishlistClient initialProducts={allProducts} />;
}
