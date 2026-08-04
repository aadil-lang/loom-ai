import fs from 'fs';
import path from 'path';

const getFilePath = (fileName: string) => path.join(process.cwd(), 'src', 'mocks', fileName);

// Using 'any' type temporarily for mock data. In a real backend, we'd share interfaces.
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getProducts(): Promise<any[]> {
  const data = fs.readFileSync(getFilePath('products.json'), 'utf8');
  return JSON.parse(data);
}

export async function getProductById(id: string): Promise<any | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function getProductsBySupplier(supplierId: string): Promise<any[]> {
  const products = await getProducts();
  return products.filter(p => p.supplierId === supplierId);
}

export async function getCategories(): Promise<any[]> {
  const data = fs.readFileSync(getFilePath('categories.json'), 'utf8');
  return JSON.parse(data);
}

export async function getColors(): Promise<any[]> {
  const data = fs.readFileSync(getFilePath('colors.json'), 'utf8');
  return JSON.parse(data);
}

export async function getCertifications(): Promise<any[]> {
  const data = fs.readFileSync(getFilePath('certifications.json'), 'utf8');
  return JSON.parse(data);
}

export async function getCountries(): Promise<any[]> {
  const data = fs.readFileSync(getFilePath('countries.json'), 'utf8');
  return JSON.parse(data);
}
