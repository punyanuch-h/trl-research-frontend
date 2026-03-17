import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface JWTPayload {
  role?: "admin" | "researcher" | string;
  exp?: number;
}

/** Get the access token from any available storage */
export function getToken(): string | null {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

/** Get the refresh token from any available storage */
export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
}

/** Check if the current session should be persistent (Remember Me was checked) */
export function isPersistent(): boolean {
  return !!localStorage.getItem("refresh_token");
}

/** 
 * Set both tokens in the specified storage. 
 * Default is sessionStorage if rememberMe is false.
 */
export function setTokens(token: string, refreshToken: string, rememberMe?: boolean) {
  // If rememberMe is not provided, try to detect from current storage
  const persistent = rememberMe !== undefined ? rememberMe : isPersistent();
  const storage = persistent ? localStorage : sessionStorage;

  // Clear other storage to avoid confusion
  const otherStorage = persistent ? sessionStorage : localStorage;
  otherStorage.removeItem("token");
  otherStorage.removeItem("refresh_token");

  storage.setItem("token", token);
  storage.setItem("refresh_token", refreshToken);
}

/** Decode role directly from stored token */
export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.role || null;
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
}

/** 
 * Check if the user is "potentially authenticated".
 * Returns true if we have an unexpired token OR if we have a refresh token (to allow the interceptor to work).
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  const refreshToken = getRefreshToken();

  if (!token && !refreshToken) return false;

  if (token) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      // If token is NOT expired, we are definitely authenticated
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        return true;
      }
    } catch {
      // Invalid token, but maybe refresh token can save us
    }
  }

  // If token is missing or expired, but we have a refresh token, we stay "auth-positive" 
  // to give the Axios interceptor a chance to refresh it silently.
  return !!refreshToken;
}

/** Simple local logout - clear all tokens */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refresh_token");
  localStorage.removeItem("pendingLogout");
}

/** 
 * API-based logout - notifies the backend to revoke the token.
 * Should be called whenever possible instead of raw logout().
 * Enforces a 5-second timeout so a slow backend can't hang the UI.
 */
export async function apiLogout(baseURL: string) {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Logout request timed out")), 5000)
    );
    try {
      await Promise.race([
        axios.post(`${baseURL}/auth/logout`, { refresh_token: refreshToken }),
        timeoutPromise,
      ]);
    } catch (error) {
      console.warn("Backend logout failed:", error);
    }
  }
  logout();
}
