/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export async function getProducts(filters?: any): Promise<any[]> {
  const query = new URLSearchParams(filters || {}).toString();
  const response = await api.get(`/products?${query}`);
  return response.data;
}

export async function getProductById(id: string): Promise<any | null> {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getProductsBySupplier(supplierId: string): Promise<any[]> {
  const response = await api.get(`/products?supplierId=${supplierId}`);
  return response.data;
}

export async function getCategories(): Promise<any[]> {
  const response = await api.get('/categories');
  return response.data;
}

// These endpoints don't explicitly exist on the backend yet, 
// we will just return mock arrays or hit an empty route for now.
export async function getColors(): Promise<any[]> {
  return [ { id: "c1", name: "Red", hexCode: "#FF0000" }, { id: "c2", name: "Blue", hexCode: "#0000FF" } ];
}

export async function getCertifications(): Promise<any[]> {
  return [ { id: "cert1", name: "GOTS" }, { id: "cert2", name: "Oeko-Tex" } ];
}

export async function getCountries(): Promise<any[]> {
  return [ { id: "in", name: "India" }, { id: "cn", name: "China" }, { id: "tr", name: "Turkey" } ];
}
