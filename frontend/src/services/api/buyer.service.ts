/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export async function getBuyerProfile(): Promise<any> {
  const response = await api.get('/buyer/profile');
  return response.data;
}

export async function getBuyerOrders(): Promise<any[]> {
  const response = await api.get('/buyer/orders');
  return response.data;
}

export async function getSavedSuppliers(): Promise<any[]> {
  // Not implemented on backend yet, return empty array for now
  return [];
}

// Additional Buyer APIs exposed to UI
export async function getCart(): Promise<any> {
  const response = await api.get('/buyer/cart');
  return response.data;
}

export async function addToCart(productId: string, quantity: number): Promise<any> {
  const response = await api.post('/buyer/cart', { productId, quantity });
  return response.data;
}

export async function processCheckout(shippingAddressId: string): Promise<any> {
  const response = await api.post('/buyer/checkout', { shippingAddressId });
  return response.data;
}
