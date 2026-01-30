import { tokenStorage } from "./token-storage";
import { createApiError } from "./errors";

const BASE_URL =
  import.meta.env.VITE_BASE_API_URL || "https://rest-test.machineheads.ru";

export interface RequestConfig extends RequestInit {
  requireAuth?: boolean;
  _isRetry?: boolean;
}

class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;

  private async refreshToken(): Promise<void> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const formData = new FormData();
    formData.append("refresh_token", refreshToken);

    const response = await fetch(`${BASE_URL}/auth/token-refresh`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      tokenStorage.clearTokens();
      window.location.href = "/vantage-point/";
      throw new Error("Refresh failed");
    }

    const data = await response.json();
    tokenStorage.setTokens(data.access_token, data.refresh_token);
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requireAuth = true, _isRetry = false, ...fetchConfig } = config;

    const url = `${BASE_URL}${endpoint}`;
    const headers = new Headers(fetchConfig.headers);

    if (requireAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });

    if (response.status === 401 && requireAuth && !_isRetry) {
      try {
        await this.refreshToken();

        return this.request<T>(endpoint, { ...config, _isRetry: true });
      } catch (error) {
        window.location.href = "/vantage-point/";
        throw error;
      }
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw createApiError(response, data);
    }

    return response.json();
  }

  private async requestWithHeaders<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<{ data: T; headers: Record<string, string> }> {
    const { requireAuth = true, _isRetry = false, ...fetchConfig } = config;

    const url = `${BASE_URL}${endpoint}`;
    const headers = new Headers(fetchConfig.headers);

    if (requireAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });

    if (response.status === 401 && requireAuth && !_isRetry) {
      try {
        await this.refreshToken();

        return this.requestWithHeaders<T>(endpoint, {
          ...config,
          _isRetry: true,
        });
      } catch (error) {
        window.location.href = "/vantage-point/";
        throw error;
      }
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw createApiError(response, data);
    }

    const data = await response.json();

    return {
      data,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  getWithHeaders<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<{ data: T; headers: Record<string, string> }> {
    return this.requestWithHeaders<T>(endpoint, { ...config, method: "GET" });
  }

  post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const headers: Record<string, string> = {};

    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body,
      headers,
    });
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
