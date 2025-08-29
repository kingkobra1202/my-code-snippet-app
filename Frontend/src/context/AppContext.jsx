import React, { useState, useContext, createContext } from "react";

// Create the context
const AppContext = createContext();

// Create the provider component
const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);

  // Static data for demonstration
  const staticData = {
    languages: [
      {
        id: 1,
        name: "React",
        description: "Modern JavaScript UI Library",
        icon: "⚛️",
        snippets: 25,
      },
      {
        id: 2,
        name: "HTML & CSS",
        description: "Fundamental Web Technologies",
        icon: "🌐",
        snippets: 15,
      },
      {
        id: 3,
        name: "Flutter",
        description: "UI Toolkit for mobile, web, and desktop",
        icon: "🐦",
        snippets: 5,
      },
      {
        id: 4,
        name: "Java",
        description: "Popular object-oriented programming language",
        icon: "☕",
        snippets: 12,
      },
    ],
    pageTypes: [
      {
        id: 101,
        name: "Login Pages",
        languageId: 1,
        description: "Attractive login form designs",
      },
      {
        id: 102,
        name: "Dashboards",
        languageId: 1,
        description: "Responsive dashboard layouts",
      },
      {
        id: 103,
        name: "Buttons",
        languageId: 2,
        description: "Creative button styles and animations",
      },
      {
        id: 104,
        name: "List Views",
        languageId: 3,
        description: "Elegant list and grid views",
      },
      {
        id: 105,
        name: "Search Bars",
        languageId: 2,
        description: "Modern search bar components",
      },
      {
        id: 106,
        name: "Sidebars",
        languageId: 1,
        description: "Animated side navigation menus",
      },
    ],
    // New mock data for snippets
    snippets: [
      {
        id: 1001,
        categoryId: 101,
        title: "React Login Form with Tailwind",
        description: "A simple, responsive login form.",
        code: "const LoginForm = () => {\n  // code here\n};",
      },
      {
        id: 1002,
        categoryId: 101,
        title: "Animated Login Page",
        description: "A login page with a subtle background animation.",
        code: "const AnimatedLogin = () => {\n  // code here\n};",
      },
      {
        id: 1003,
        categoryId: 102,
        title: "Simple React Dashboard",
        description: "A basic dashboard layout with cards and a sidebar.",
        code: "const Dashboard = () => {\n  // code here\n};",
      },
      {
        id: 1004,
        categoryId: 103,
        title: "Hover Effect Buttons",
        description: "Buttons with various hover effects using Tailwind.",
        code: ".btn-hover { /* css here */ }",
      },
      {
        id: 1005,
        categoryId: 105,
        title: "Expanding Search Bar",
        description: "A search bar that expands on focus.",
        code: "const SearchBar = () => {\n  // code here\n};",
      },
    ],
  };

  // Mock login function
  const login = (email, password, role) => {
    if (role === "1") {
      setIsAdmin(true);
      setUserId("admin-user-id");
    } else {
      setIsAdmin(false);
      setUserId("client-user-id");
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setUserId(null);
  };

  // New functions to get data based on ID
  const getLanguageById = (id) =>
    staticData.languages.find((lang) => lang.id === parseInt(id));
  const getCategoriesByLanguageId = (id) =>
    staticData.pageTypes.filter((cat) => cat.languageId === parseInt(id));
  const getCategoryById = (id) =>
    staticData.pageTypes.find((cat) => cat.id === parseInt(id));
  const getSnippetsByCategoryId = (id) =>
    staticData.snippets.filter(
      (snippet) => snippet.categoryId === parseInt(id)
    );

  const value = {
    isAdmin,
    userId,
    login,
    logout,
    languages: staticData.languages,
    pageTypes: staticData.pageTypes,
    snippets: staticData.snippets,
    getLanguageById,
    getCategoriesByLanguageId,
    getCategoryById,
    getSnippetsByCategoryId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
const useApp = () => {
  return useContext(AppContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AppProvider, useApp };
