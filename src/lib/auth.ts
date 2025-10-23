import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  role?: "admin" | "researcher" | string;
  exp?: number;
}

/** Decode role directly from stored token */
export function getUserRole(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.role || null;
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
}

/** Check if token exists and not expired */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
}

/** Logout and clear token */
export function logout() {
  localStorage.removeItem("auth_token");
}
