import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found in localStorage");
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.log("Token expired");
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Token decode error:", error.message);
    return false;
  }
};

export const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found for getRole");
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    console.log("getRole decoded:", decoded);
    return decoded.role || null;
  } catch (error) {
    console.error("getRole decode error:", error.message);
    return null;
  }
};

export const logout = () => {
  // Clear the token from localStorage
  localStorage.removeItem("token");
  console.log("User logged out successfully");
  // You might want to redirect the user to the login page
  // window.location.href = "/login";
};
