import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaCode } from "react-icons/fa";
import { isAuthenticated, getRole } from "../utils/auth";

const API_BASE = import.meta.env.VITE_API_URL;

const AdminCategories = () => {
  const { name: rawLanguageName } = useParams();
  const languageName = rawLanguageName
    ? rawLanguageName.toLowerCase()
    : undefined;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    console.log("Language name from useParams (normalized):", languageName);
    if (!languageName) {
      setError("No language name provided in URL");
      setLoading(false);
      navigate("/admin");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      console.log(`Fetching categories for language: ${languageName}`);
      const response = await fetch(
        `${API_BASE}/api/admin/languages/${languageName}/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const text = await response.text();
      console.log(
        `Categories response for ${languageName}:`,
        response.status,
        text
      );
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Categories parse error:", e.message, text);
        throw new Error(`Failed to parse categories response: ${e.message}`);
      }
      if (response.ok) {
        setCategories(data);
      } else {
        setError(data.error || "Failed to load categories");
      }
    } catch (err) {
      console.error("Fetch categories error:", err.message);
      setError(`Server error: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [languageName, navigate]);

  useEffect(() => {
    console.log(
      "AdminCategories mounted with raw languageName:",
      rawLanguageName,
      "normalized:",
      languageName
    );
    if (!isAuthenticated()) {
      console.log("Not authenticated, redirecting to /login");
      navigate("/login");
      return;
    }
    if (getRole() !== "admin") {
      console.log("Not admin, redirecting to /");
      navigate("/");
      return;
    }
    fetchCategories();
  }, [languageName, rawLanguageName, navigate, fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.description) {
      setError("Name and description are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/admin/languages/${languageName}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCategory),
        }
      );
      const data = await response.json();
      console.log("Add category response:", response.status, data);
      if (response.ok) {
        setCategories([...categories, data]);
        setNewCategory({ name: "", description: "" });
        setError("");
      } else {
        setError(data.error || "Failed to add category");
      }
    } catch (err) {
      console.error("Add category error:", err.message);
      setError(`Server error: ${err.message}. Please try again.`);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!editCategory.name || !editCategory.description) {
      setError("Name and description are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/admin/languages/${languageName}/categories/${editCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editCategory.name,
            description: editCategory.description,
          }),
        }
      );
      const data = await response.json();
      console.log("Update category response:", response.status, data);
      if (response.ok) {
        setCategories(
          categories.map((cat) => (cat._id === editCategory.id ? data : cat))
        );
        setEditCategory(null);
        setError("");
      } else {
        setError(data.error || "Failed to update category");
      }
    } catch (err) {
      console.error("Update category error:", err.message);
      setError(`Server error: ${err.message}. Please try again.`);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/admin/languages/${languageName}/categories/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      console.log("Delete category response:", response.status, data);
      if (response.ok) {
        setCategories(categories.filter((cat) => cat._id !== id));
        setShowConfirmDelete(null);
        setError("");
      } else {
        setError(data.error || "Failed to delete category");
      }
    } catch (err) {
      console.error("Delete category error:", err.message);
      setError(`Server error: ${err.message}. Please try again.`);
    }
  };

  const handleCategoryClick = (category) => {
    const encodedCategoryName = encodeURIComponent(category.name);
    console.log(
      `Navigating to /admin/languages/${languageName}/categories/${encodedCategoryName}/snippets`
    );
    navigate(
      `/admin/languages/${languageName}/categories/${encodedCategoryName}/snippets`
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Admin Categories for{" "}
          <span className="text-orange-400 capitalize">
            {languageName || "Unknown"}
          </span>
        </h1>
        <p className="text-gray-400 mb-8">
          Manage categories for the selected language.
        </p>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {loading && <p className="text-gray-400 mb-4">Loading categories...</p>}
        {!languageName && (
          <p className="text-yellow-400 text-lg mb-6 p-4 rounded-lg bg-yellow-900/50">
            **Notice:** No language was specified in the URL. Please select a
            language from the Admin Dashboard.
          </p>
        )}

        <Link
          to="/admin"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition mb-8"
        >
          Back to Admin Dashboard
        </Link>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Add New Category</h2>
          <form
            onSubmit={handleAddCategory}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Category Name
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                  placeholder="e.g., Hooks"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                  placeholder="e.g., Customizable React hooks"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-pink-600 transition-all"
            >
              Add Category
            </button>
          </form>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Categories</h2>
          {categories.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-400">
              No categories available for {languageName || "Unknown"}. Add one
              above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 flex justify-between items-center transition-all transform hover:scale-105"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center rounded mr-4 bg-gradient-to-br from-blue-500 to-purple-600">
                        <FaCode className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-semibold">
                          {cat.name}
                        </span>
                        <p className="text-gray-400 text-sm">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditCategory({
                          id: cat._id,
                          name: cat.name,
                          description: cat.description,
                        })
                      }
                      className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-all"
                    >
                      <FaEdit className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(cat._id)}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-500 transition-all"
                    >
                      <FaTrash className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {editCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
              <form onSubmit={handleEditCategory}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="edit-category-name"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Category Name
                    </label>
                    <input
                      id="edit-category-name"
                      type="text"
                      value={editCategory.name}
                      onChange={(e) =>
                        setEditCategory({
                          ...editCategory,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                      placeholder="e.g., Hooks"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-description"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Description
                    </label>
                    <input
                      id="edit-description"
                      type="text"
                      value={editCategory.description}
                      onChange={(e) =>
                        setEditCategory({
                          ...editCategory,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                      placeholder="e.g., Customizable React hooks"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-pink-600 transition-all"
                  >
                    Update Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditCategory(null)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
                  >
                    <FaTimes className="h-5 w-5 text-white" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this category? This action
                cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeleteCategory(showConfirmDelete)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(null)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
