/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export async function getOrders(): Promise<any[]> {
  // This is generic, we'll route it dynamically based on user role.
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (user?.role === 'Supplier') {
    const response = await api.get('/supplier/orders');
    return response.data;
  } else {
    const response = await api.get('/buyer/orders');
    return response.data;
  }
}

export async function getOrdersBySupplier(supplierId: string): Promise<any[]> {
  const response = await api.get('/supplier/orders');
  return response.data;
}

export async function getOrderById(id: string): Promise<any | null> {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  try {
    if (user?.role === 'Supplier') {
      const response = await api.get(`/supplier/orders/${id}`);
      return response.data;
    } else {
      const response = await api.get(`/buyer/orders/${id}`);
      return response.data;
    }
  } catch (err) {
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<any> {
  const response = await api.patch(`/supplier/orders/${orderId}/status`, { status });
  return response.data;
}

export async function createOrder(orderData: any): Promise<any> {
  const response = await api.post('/buyer/checkout', orderData);
  return response.data;
}
