import * as React from 'react';
import { notFound } from 'next/navigation';
import { productService } from '@/services';
import { ProductForm } from '@/components/supplier/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    productService.getProductById(params.id),
    productService.getCategories()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <ProductForm initialData={product} categories={categories} mode="edit" />
    </div>
  );
}
