export const ADMIN_API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || 'http://localhost:8000/api';

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

class ApiClient {
  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...customConfig } = options;
    const headers = {
      'Content-Type': 'application/json',
      ...customConfig.headers,
    };

    const config: RequestInit = {
      ...customConfig,
      headers,
    };

    let url = `${ADMIN_API_BASE_URL}${endpoint}`;
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
        return {} as T; // Return empty data on error instead of throwing to prevent crashing the UI
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
