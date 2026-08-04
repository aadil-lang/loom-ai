import api from '../api';

export async function login(credentials: any): Promise<any> {
  const response: any = await api.post('/auth/login', credentials);
  if (response.data?.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export async function registerBuyer(data: any): Promise<any> {
  const response: any = await api.post('/auth/register/buyer', data);
  if (response.data?.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export async function registerSupplier(data: any): Promise<any> {
  const response: any = await api.post('/auth/register/supplier', data);
  if (response.data?.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch (err) {
    console.error('Logout error', err);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export function getCurrentUser(): any {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
  }
  return null;
}
