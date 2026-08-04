/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export async function getSuppliers(): Promise<any[]> {
  // Not implemented on backend (supplier discovery). 
  return [];
}

export async function getSupplierById(id: string): Promise<any | null> {
  // Not implemented on backend (supplier details).
  return null;
}

export async function getSupplierProfile(): Promise<any> {
  const response = await api.get('/supplier/profile');
  return response.data;
}

export async function getSupplierDashboard(): Promise<any> {
  const response = await api.get('/supplier/dashboard');
  return response.data;
}
