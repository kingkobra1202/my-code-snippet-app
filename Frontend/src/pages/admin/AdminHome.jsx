import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Dummy authentication functions for demonstration
const isAuthenticated = () => localStorage.getItem("token") !== null;
const getRole = () => localStorage.getItem("role") || "user";

const API_BASE = import.meta.env.VITE_API_URL;

// Inline SVG Icons (unchanged from your provided code)
const PlusIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const TrashIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-9H7a4 4 0 01-4-4V3a1 1 0 011-1h16a1 1 0 011 1v1a4 4 0 01-4 4z"
    />
  </svg>
);
const EditIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-9-4l7.25-7.25a2 2 0 012.828 0l2.122 2.122a2 2 0 010 2.828L15 13m-4-4L5 15h4l7-7-4-4z"
    />
  </svg>
);
const CloseIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const CodeIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);
const SignOutIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);
const UserPlusIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 15h8v2a2 2 0 01-2 2h-6a2 2 0 01-2-2v-2z"
    />
  </svg>
);
const UserIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, snippets: 0, languages: 0 });
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState({ name: "", color: "" });
  const [editLanguage, setEditLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [adminRequests, setAdminRequests] = useState([
    {
      _id: "req1",
      username: "dummyUser1",
      email: "dummy1@example.com",
      createdAt: "2025-08-20T10:00:00.000Z",
    },
    {
      _id: "req2",
      username: "dummyUser2",
      email: "dummy2@example.com",
      createdAt: "2025-08-21T11:30:00.000Z",
    },
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No authentication token found");
      setError("No authentication token found");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      console.log("Attempting to fetch languages...");
      const langResponse = await fetch("${API_BASE}/api/admin/languages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const langText = await langResponse.text();
      console.log("Admin languages response:", langResponse.status, langText);
      let langData;
      try {
        langData = JSON.parse(langText);
      } catch (e) {
        console.error("Languages parse error:", e.message, langText);
        throw new Error(`Failed to parse languages response: ${e.message}`);
      }
      if (langResponse.ok) {
        const mappedLanguages = langData.map((lang) => ({
          id: lang._id,
          name: lang.name,
          snippets: `${lang.snippets}+`,
          color: lang.color,
        }));
        console.log("Mapped languages:", mappedLanguages);
        setLanguages(mappedLanguages);
      } else {
        setError(
          `Failed to load languages: ${
            langData.error || langResponse.statusText
          }`
        );
      }

      console.log("Attempting to fetch stats...");
      const statsResponse = await fetch("${API_BASE}/api/stats");
      const statsText =
        statsResponse.status === 204 ? "{}" : await statsResponse.text();
      console.log("Stats response:", statsResponse.status, statsText);
      let statsData;
      try {
        statsData = JSON.parse(statsText);
      } catch (e) {
        console.error("Stats parse error:", e.message, statsText);
        throw new Error(`Failed to parse stats response: ${e.message}`);
      }
      if (statsResponse.ok) {
        setStats(statsData);
      } else {
        setError(
          `Failed to load stats: ${statsData.error || statsResponse.statusText}`
        );
      }

      console.log("Attempting to fetch users...");
      const usersResponse = await fetch("${API_BASE}/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersText =
        usersResponse.status === 204 ? "[]" : await usersResponse.text();
      console.log("Users response:", usersResponse.status, usersText);
      let usersData;
      try {
        usersData = JSON.parse(usersText);
      } catch (e) {
        console.error("Users parse error:", e.message, usersText);
        throw new Error(`Failed to parse users response: ${e.message}`);
      }
      if (usersResponse.ok) {
        setUsers(usersData);
      } else {
        setError(
          `Failed to load users: ${usersData.error || usersResponse.statusText}`
        );
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError(`Server error: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Checking authentication...");
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
    fetchData();
  }, [navigate, fetchData]);

  const handleAddLanguage = async (e) => {
    e.preventDefault();
    if (!newLanguage.name || !newLanguage.color) {
      setError("Name and color are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("${API_BASE}/api/admin/languages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLanguage),
      });
      const data = await response.json();
      console.log("Add language response:", response.status, data);
      if (response.ok) {
        setLanguages([
          ...languages,
          { id: data._id, name: data.name, snippets: "0+", color: data.color },
        ]);
        setNewLanguage({ name: "", color: "" });
        setError("");
      } else {
        setError(data.error || "Failed to add language");
      }
    } catch (err) {
      console.error("Add language error:", err.message);
      setError(`Server error: ${err.message}. Please try again.`);
    }
  };

  const handleEditLanguage = async (e) => {
    e.preventDefault();
    if (!editLanguage.name || !editLanguage.color) {
      setError("Name and color are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/admin/languages/${editLanguage.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editLanguage.name,
            color: editLanguage.color,
          }),
        }
      );
      const data = await response.json();
      console.log("Update language response:", response.status, data);
      if (response.ok) {
        setLanguages(
          languages.map((lang) =>
            lang.id === editLanguage.id
              ? { ...lang, name: data.name, color: data.color }
              : lang
          )
        );
        setEditLanguage(null);
        setError("");
      } else {
        setError(data.error || "Failed to update language");
      }
    } catch (err) {
      console.error("Update language error:", err.message);
      setError(`Server error: ${err.message}. Please try again.`);
    }
  };

  const handleDeleteLanguage = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/admin/languages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Delete language response:", response.status, data);
      if (response.ok) {
        setLanguages(languages.filter((lang) => lang.id !== id));
        setShowConfirmDelete(null);
        setError("");
      } else {
        setError(data.error || "Failed to delete language");
      }
    } catch (err) {
      console.error("Delete language error:", err.message);
      setError(`Server error: ${err.message}. Please try again.`);
    }
  };

  const handleLanguageClick = (e, lang) => {
    e.preventDefault();
    e.stopPropagation();
    if (!lang.name) {
      console.warn("Language name is undefined or empty:", lang);
      setError("Cannot navigate: Language name is missing");
      return;
    }
    const targetPath = `/admin/languages/${encodeURIComponent(
      lang.name.toLowerCase()
    )}/categories`;
    console.log(`Navigating to ${targetPath}`, lang);
    navigate(targetPath);
  };

  const confirmLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleAcceptRequest = (requestId) => {
    console.log(`Accepting admin request: ${requestId}`);
    setAdminRequests(adminRequests.filter((req) => req._id !== requestId));
  };

  const handleRejectRequest = (requestId) => {
    console.log(`Rejecting admin request: ${requestId}`);
    setAdminRequests(adminRequests.filter((req) => req._id !== requestId));
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowRequestsModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
            >
              <UserPlusIcon className="h-5 w-5" /> Admin Requests
              {adminRequests.length > 0 && (
                <span className="ml-1 px-2 py-1 bg-red-600 rounded-full text-xs font-bold">
                  {adminRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition-all"
            >
              <SignOutIcon className="h-5 w-5" /> Logout
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {loading && <p className="text-gray-400 mb-4">Loading...</p>}

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setShowUsersModal(true)}
              className="cursor-pointer bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-slate-700/50 transition-all transform hover:scale-105"
            >
              <div className="text-4xl font-bold text-orange-400">
                {stats.users}
              </div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">
                Users
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-teal-400">
                {stats.languages}
              </div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">
                Languages
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-pink-400">
                {stats.snippets}
              </div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">
                Snippets
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Add New Language</h2>
          <form
            onSubmit={handleAddLanguage}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Language Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newLanguage.name}
                  onChange={(e) =>
                    setNewLanguage({ ...newLanguage, name: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                  placeholder="e.g., JavaScript"
                />
              </div>
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Gradient Color
                </label>
                <input
                  id="color"
                  type="text"
                  value={newLanguage.color}
                  onChange={(e) =>
                    setNewLanguage({ ...newLanguage, color: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                  placeholder="e.g., from-blue-500 to-purple-600"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-pink-600 transition-all"
            >
              Add Language
            </button>
          </form>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Languages</h2>
          {languages.length === 0 && !loading ? (
            <p className="text-center text-gray-400">
              No languages available. Add one above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 flex justify-between items-center hover:bg-slate-700/50 transition-all transform hover:scale-105"
                >
                  {lang.name ? (
                    <div
                      className="flex items-center flex-1 cursor-pointer"
                      onClick={(e) => handleLanguageClick(e, lang)}
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded mr-4 bg-gradient-to-br ${lang.color}`}
                      >
                        <CodeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-semibold">
                          {lang.name}
                        </span>
                        <p className="text-gray-400 text-sm">
                          {lang.snippets} snippets
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center flex-1 text-gray-400">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded mr-4 bg-gradient-to-br ${lang.color}`}
                      >
                        <CodeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-semibold">
                          Unnamed Language
                        </span>
                        <p className="text-gray-400 text-sm">
                          {lang.snippets} snippets
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditLanguage({
                          id: lang.id,
                          name: lang.name || "",
                          color: lang.color,
                        })
                      }
                      className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-all"
                    >
                      <EditIcon className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(lang.id)}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-500 transition-all"
                    >
                      <TrashIcon className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {editLanguage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Edit Language</h3>
              <form onSubmit={handleEditLanguage}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="edit-name"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Language Name
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editLanguage.name}
                      onChange={(e) =>
                        setEditLanguage({
                          ...editLanguage,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                      placeholder="e.g., JavaScript"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-color"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Gradient Color
                    </label>
                    <input
                      id="edit-color"
                      type="text"
                      value={editLanguage.color}
                      onChange={(e) =>
                        setEditLanguage({
                          ...editLanguage,
                          color: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                      placeholder="e.g., from-blue-500 to-purple-600"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-pink-600 transition-all"
                  >
                    Update Language
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditLanguage(null)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
                  >
                    <CloseIcon className="h-5 w-5 text-white" />
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
                Are you sure you want to delete this language? This action
                cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeleteLanguage(showConfirmDelete)}
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

        {showRequestsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Admin Requests</h3>
                <button onClick={() => setShowRequestsModal(false)}>
                  <CloseIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                </button>
              </div>
              {adminRequests.length === 0 ? (
                <p className="text-gray-400 text-center">
                  No pending admin requests.
                </p>
              ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {adminRequests.map((request) => (
                    <li
                      key={request._id}
                      className="bg-slate-700/50 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-lg font-medium">
                          {request.username}
                        </p>
                        <p className="text-sm text-gray-400">{request.email}</p>
                        <p className="text-xs text-gray-500">
                          Requested:{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-500 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-500 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to log out?
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={confirmLogout}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition-all"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showUsersModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Registered Users</h3>
                <button onClick={() => setShowUsersModal(false)}>
                  <CloseIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                </button>
              </div>
              {users.length === 0 ? (
                <p className="text-gray-400 text-center">No users found.</p>
              ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {users.map((user) => (
                    <li
                      key={user._id}
                      className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-4"
                    >
                      <UserIcon className="h-8 w-8 text-white" />
                      <div>
                        <p className="text-lg font-medium">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Joined:{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
