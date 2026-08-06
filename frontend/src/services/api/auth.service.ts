import api from '../api';

interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: Record<string, unknown>;
  }
}

export async function loginBuyer(credentials: Record<string, unknown>): Promise<unknown> {
  const response = (await api.post('/auth/buyer/login', credentials)) as AuthResponse;
  if (response.data?.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export async function loginSupplier(credentials: Record<string, unknown>): Promise<unknown> {
  const response = (await api.post('/auth/supplier/login', credentials)) as AuthResponse;
  if (response.data?.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export async function registerBuyer(data: Record<string, unknown>): Promise<unknown> {
  const response = (await api.post('/auth/buyer/register', data)) as AuthResponse;
  if (response.data?.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export async function registerSupplier(data: Record<string, unknown>): Promise<unknown> {
  const response = (await api.post('/auth/supplier/register', data)) as AuthResponse;
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

export function getCurrentUser(): Record<string, unknown> | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
  }
  return null;
}
