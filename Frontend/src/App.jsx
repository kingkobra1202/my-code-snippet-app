import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { isAuthenticated, getRole } from "./utils/auth";

// Client Pages
import HomePage from "./pages/client/HomePage.jsx";
import LoginPage from "./pages/client/LoginPage.jsx";
import LanguageCategoriesPage from "./pages/client/LanguageCategoriesPage.jsx";
import CategorySnippetListPage from "./pages/client/CategorySnippetListPage.jsx";
import SnippetDetailPage from "./pages/client/SnippetDetailPage.jsx";

// Admin Pages
import AdminHome from "./pages/admin/AdminHome.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminSnippets from "./pages/admin/AdminSnippets.jsx";

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";

// Protect admin routes
function ProtectedRoute({ children, adminOnly }) {
  const isAuth = isAuthenticated();
  const role = getRole();
  const currentPath = window.location.pathname;
  console.log("ProtectedRoute check:", {
    isAuth,
    role,
    adminOnly,
    path: currentPath,
  });
  if (!isAuth) {
    console.log("Not authenticated, redirecting to /login from", currentPath);
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && role !== "admin") {
    console.log("Not admin, redirecting to / from", currentPath);
    return <Navigate to="/" replace />;
  }
  return children;
}

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/languages/:name"
              element={<LanguageCategoriesPage />}
            />
            <Route
              path="/languages/:name/:categoryName"
              element={<CategorySnippetListPage />}
            />
            <Route
              path="/languages/:name/:categoryName/:snippetId"
              element={<SnippetDetailPage />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/languages/:name/categories"
              element={
                <ProtectedRoute adminOnly>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/languages/:name/categories/:categoryName/snippets"
              element={
                <ProtectedRoute adminOnly>
                  <AdminSnippets />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center text-white text-2xl bg-gray-900">
                  404 - Page not found
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
