/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export async function getNotifications(): Promise<any[]> {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  
  const role = user?.role === 'Supplier' ? 'supplier' : 'buyer';
  const response = await api.get(`/${role}/notifications`);
  return response.data || [];
}

export async function markAsRead(id: string): Promise<void> {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role === 'Supplier' ? 'supplier' : 'buyer';
  
  await api.patch(`/${role}/notifications/${id}/read`);
}
