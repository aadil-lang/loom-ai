import * as React from 'react';
import { productService } from '@/services';
import { InventoryClient } from '@/components/supplier/InventoryClient';

export default async function InventoryPage() {
  const supplierId = 's1'; 
  const products = await productService.getProductsBySupplier(supplierId);

  return <InventoryClient initialProducts={products} />;
}
