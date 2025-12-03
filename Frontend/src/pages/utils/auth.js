import { jwtDecode } from "jwt-decode";

/**
 * Check if user is authenticated by verifying JWT token in localStorage.
 * - Returns true if token exists and is not expired.
 * - Returns false otherwise.
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Silent fail: no token
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    if (decoded.exp && decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return false;
    }
    return true;
  } catch (error) {
    // Invalid token format
    console.error("Token decode error:", error.message);
    localStorage.removeItem("token");
    return false;
  }
};

/**
 * Get user role from JWT token.
 * - Returns role string if present.
 * - Returns null if no token or invalid.
 */
export const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error("getRole decode error:", error.message);
    return null;
  }
};

/**
 * Logout user by clearing localStorage.
 * - Removes token, username, and role.
 * - Optionally redirect to login page.
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  // Redirect if needed:
  // window.location.href = "/login";
};
