import axios, { type AxiosInstance, type AxiosStatic, type InternalAxiosRequestConfig } from "axios";
import { getToken, getRefreshToken, setTokens, logout } from "@/lib/auth";

const { create }: AxiosStatic = axios;

// Extend AxiosRequestConfig to include our retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export class ApiBaseClient {
  readonly axiosInstance: AxiosInstance;

  /**
   * Static promise to handle multiple concurrent 401s (Thundering Herd).
   * All failing requests will wait for this single promise to resolve.
   */
  private static refreshPromise: Promise<string | null> | null = null;

  constructor(
    baseURL: string,
    headers?: NonNullable<Parameters<typeof create>[0]>["headers"]
  ) {
    this.axiosInstance = create({
      baseURL,
      headers,
    });

    // Request Interceptor: Always attach the latest token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Handle 401 or 498 errors and trigger refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Trigger refresh on 401 (Unauthorized) or 498 (Token Expired)
        // Check _retry to prevent infinite feedback loops if refresh also fails
        const status = error.response?.status;
        if ((status === 401 || status === 498) && !originalRequest._retry) {
          // If this was a login attempt, don't trigger refresh/redirect logic
          if (originalRequest.url?.includes("/auth/login")) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            // Only redirect if we were actually authenticated before (had a refresh token)
            // If we didn't even have a refresh token, we probably weren't logged in,
            // but we should still clear everything just in case.
            logout();
            
            // Avoid redirecting if we are already on the login page to prevent reloads/lost state
            if (!window.location.hash.includes("/login")) {
              window.location.href = "/login?session_expired=true";
            }
            return Promise.reject(error);
          }

          try {
            // If a refresh is already in progress, wait for it
            if (!ApiBaseClient.refreshPromise) {
              ApiBaseClient.refreshPromise = this.performRefresh(baseURL, refreshToken);
            }

            const newToken = await ApiBaseClient.refreshPromise;

            // Critical: Reset the promise for the NEXT time we need to refresh
            ApiBaseClient.refreshPromise = null;

            if (newToken) {
              // Update the original request with the new access token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            } else {
              // Refresh failed to return a token
              logout();
              window.location.href = "/login?session_expired=true";
              return Promise.reject(error);
            }
          } catch (refreshError) {
            ApiBaseClient.refreshPromise = null;
            logout();
            window.location.href = "/login?session_expired=true";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Calls the backend refresh endpoint to obtain a new set of tokens.
   */
  private async performRefresh(baseURL: string, refreshToken: string): Promise<string | null> {
    try {
      // Use a clean axios instance to avoid interceptor loops
      const response = await axios.post(`${baseURL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { token, refresh_token } = response.data;

      // Update tokens (automatically detects storage type)
      setTokens(token, refresh_token);

      return token;
    } catch (err) {
      console.error("Refresh token attempt failed:", err);
      return null;
    }
  }
}
