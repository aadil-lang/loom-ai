import * as React from 'react';
import { productService } from '@/services';
import { ProductForm } from '@/components/supplier/ProductForm';

export default async function NewProductPage() {
  const categories = await productService.getCategories();

  return (
    <div className="p-6 md:p-8 w-full">
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
