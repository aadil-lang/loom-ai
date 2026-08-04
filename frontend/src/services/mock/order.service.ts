import fs from 'fs';
import path from 'path';

const getFilePath = (fileName: string) => path.join(process.cwd(), 'src', 'mocks', fileName);

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getOrders(): Promise<any[]> {
  const data = fs.readFileSync(getFilePath('orders.json'), 'utf8');
  return JSON.parse(data);
}

export async function getOrdersBySupplier(supplierId: string): Promise<any[]> {
  const orders = await getOrders();
  return orders.filter(o => o.supplierId === supplierId);
}

export async function getOrderById(id: string): Promise<any | null> {
  const orders = await getOrders();
  return orders.find(o => o.id === id) || null;
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  // Mock update. Since it's a file, we could write back to it, but Next.js hot-reloads on file change.
  // In a real API, this would be a DB mutation.
  // For the sake of the mock, we'll pretend it succeeds. The UI will optimistically update.
  return Promise.resolve(true);
}
