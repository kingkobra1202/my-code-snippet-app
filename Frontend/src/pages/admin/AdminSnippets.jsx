import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const AdminSnippets = () => {
  const { name, categoryName: rawCategoryName } = useParams();
  const languageName = name ? decodeURIComponent(name) : undefined;
  const categoryName = rawCategoryName
    ? decodeURIComponent(rawCategoryName)
    : undefined;

  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSnippet, setNewSnippet] = useState({
    title: "",
    description: "",
    code: "",
    demoLink: "",
    previewImage: "", // Changed to a string for the URL
  });
  const [editSnippet, setEditSnippet] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        if (!languageName || !categoryName) {
          setError("Language or category not provided in URL.");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE}/api/admin/languages/${languageName}/categories/${categoryName}/snippets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch snippets");
        }

        const data = await response.json();
        setSnippets(data);
        setError("");
      } catch (err) {
        console.error("Error fetching snippets:", err);
        setError("Failed to load snippets");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [languageName, categoryName]);

  const handleAddSnippet = async (e) => {
    e.preventDefault();
    if (!newSnippet.title || !newSnippet.code || !newSnippet.previewImage) {
      toast.error("Please fill all required fields and provide an image URL.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/admin/languages/${languageName}/categories/${categoryName}/snippets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newSnippet),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add snippet");
      }

      const addedSnippet = await response.json();
      setSnippets([...snippets, addedSnippet]);
      setNewSnippet({
        title: "",
        description: "",
        code: "",
        demoLink: "",
        previewImage: "",
      });
      setError("");
      toast.success("Snippet added successfully!");
    } catch (err) {
      console.error("Error adding snippet:", err);
      setError("Failed to add snippet");
      toast.error("Failed to add snippet.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSnippet = async (e) => {
    e.preventDefault();
    if (!editSnippet.title || !editSnippet.code || !editSnippet.previewImage) {
      toast.error("Please fill all required fields and provide an image URL.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/admin/languages/${languageName}/categories/${categoryName}/snippets/${editSnippet._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editSnippet),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update snippet");
      }

      const updatedSnippet = await response.json();
      setSnippets(
        snippets.map((s) => (s._id === updatedSnippet._id ? updatedSnippet : s))
      );
      setIsEditModalOpen(false);
      setEditSnippet(null);
      setError("");
      toast.success("Snippet updated successfully!");
    } catch (err) {
      console.error("Error updating snippet:", err);
      setError("Failed to update snippet");
      toast.error("Failed to update snippet.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSnippet = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/admin/languages/${languageName}/categories/${categoryName}/snippets/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete snippet");
      }

      setSnippets(snippets.filter((snippet) => snippet._id !== id));
      setIsDeleteModalOpen(false);
      setSnippetToDelete(null);
      setError("");
      toast.success("Snippet deleted successfully!");
    } catch (err) {
      console.error("Error deleting snippet:", err);
      setError("Failed to delete snippet");
      toast.error("Failed to delete snippet.");
    }
  };

  const openEditModal = (snippet) => {
    setEditSnippet({ ...snippet });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (snippet) => {
    setSnippetToDelete(snippet);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter text-white">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">
          Manage Snippets for {categoryName}
        </h1>
        <div className="mb-12 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-6">Add New Snippet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Snippet Title"
              value={newSnippet.title}
              onChange={(e) =>
                setNewSnippet({ ...newSnippet, title: e.target.value })
              }
              className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <input
              type="text"
              placeholder="Description"
              value={newSnippet.description}
              onChange={(e) =>
                setNewSnippet({ ...newSnippet, description: e.target.value })
              }
              className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <textarea
              placeholder="Code"
              value={newSnippet.code}
              onChange={(e) =>
                setNewSnippet({ ...newSnippet, code: e.target.value })
              }
              className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all col-span-2"
              rows="5"
            />
            <div className="flex flex-col">
              <label htmlFor="add-image" className="text-gray-400 text-sm mb-1">
                Preview Image URL
              </label>
              <input
                id="add-image"
                type="text"
                placeholder="Paste Appwrite Image URL here"
                value={newSnippet.previewImage}
                onChange={(e) =>
                  setNewSnippet({ ...newSnippet, previewImage: e.target.value })
                }
                className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all"
              />
              {newSnippet.previewImage && (
                <img
                  src={newSnippet.previewImage}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>
            <input
              type="text"
              placeholder="Video Demo URL (optional)"
              value={newSnippet.demoLink}
              onChange={(e) =>
                setNewSnippet({ ...newSnippet, demoLink: e.target.value })
              }
              className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <button
            onClick={handleAddSnippet}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105"
          >
            <Plus className="inline mr-2" /> Add Snippet
          </button>
        </div>
        <h2 className="text-3xl font-semibold mb-6">Snippet List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <div
              key={snippet._id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <img
                  src={snippet.previewImage}
                  alt={snippet.title}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <span className="text-xl font-semibold">{snippet.title}</span>
                <p className="text-gray-400 text-sm">{snippet.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(snippet)}
                  className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => openDeleteModal(snippet)}
                  className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl max-w-2xl w-full">
              <h3 className="text-2xl font-semibold mb-4">Edit Snippet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Snippet Title"
                  value={editSnippet.title}
                  onChange={(e) =>
                    setEditSnippet({ ...editSnippet, title: e.target.value })
                  }
                  className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editSnippet.description}
                  onChange={(e) =>
                    setEditSnippet({
                      ...editSnippet,
                      description: e.target.value,
                    })
                  }
                  className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all"
                />
                <textarea
                  placeholder="Code"
                  value={editSnippet.code}
                  onChange={(e) =>
                    setEditSnippet({ ...editSnippet, code: e.target.value })
                  }
                  className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all col-span-2"
                  rows="5"
                />
                <div className="flex flex-col">
                  <label
                    htmlFor="edit-image"
                    className="text-gray-400 text-sm mb-1"
                  >
                    Preview Image URL
                  </label>
                  <input
                    id="edit-image"
                    type="text"
                    placeholder="Paste Appwrite Image URL here"
                    value={editSnippet.previewImage}
                    onChange={(e) =>
                      setEditSnippet({
                        ...editSnippet,
                        previewImage: e.target.value,
                      })
                    }
                    className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                  {editSnippet.previewImage && (
                    <img
                      src={editSnippet.previewImage}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Video Demo URL (optional)"
                  value={editSnippet.demoLink}
                  onChange={(e) =>
                    setEditSnippet({ ...editSnippet, demoLink: e.target.value })
                  }
                  className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSnippet}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl max-w-md w-full">
              <h3 className="text-2xl font-semibold mb-4">Delete Snippet</h3>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete "{snippetToDelete.title}"?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSnippet(snippetToDelete._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSnippets;
