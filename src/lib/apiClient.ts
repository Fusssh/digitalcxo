// Base URL configuration for Backend APIs (Admin & Website)
const RAW_BASE_URL = (
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://backenddigi-236970479379.asia-south1.run.app/api/v1'
).trim().replace(/\/+$/, '');

// Normalize base URL to ensure calls always resolve against /api/v1
export const ADMIN_API_BASE_URL = (() => {
  if (RAW_BASE_URL.endsWith('/api/v1')) return RAW_BASE_URL;
  if (RAW_BASE_URL.endsWith('/api')) return `${RAW_BASE_URL}/v1`;
  return `${RAW_BASE_URL}/api/v1`;
})();

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

class ApiClient {
  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...customConfig } = options;
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('digitalcxo_admin_token') || localStorage.getItem('token') || '')
      : '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(customConfig.headers as Record<string, string>),
    };

    const config: RequestInit = {
      ...customConfig,
      headers,
    };

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = cleanEndpoint.startsWith('/api/v1/')
      ? `${ADMIN_API_BASE_URL.replace(/\/api\/v1$/, '')}${cleanEndpoint}`
      : `${ADMIN_API_BASE_URL}${cleanEndpoint}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    try {
      const response = await fetch(url, config).catch(() => null);
      if (!response) {
        return {} as T; // Fallback empty object if network fails
      }
      
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error(`API Error [${endpoint}]:`, data.message || response.statusText);
        return data as T; // Return data on error so UI can display specific messages
      }

      return data as T;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {} as T;
    }
  }

  get<T>(endpoint: string, options: FetchOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data: any, options: FetchOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any, options: FetchOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: any, options: FetchOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, options: FetchOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const adminApi = new ApiClient();
