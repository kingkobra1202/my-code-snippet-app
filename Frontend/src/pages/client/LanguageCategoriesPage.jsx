import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Code2, ChevronRight } from "lucide-react";

const LanguageCategoriesPage = () => {
  const { name: languageName } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  // Decode URL parameter for display
  const decodedLanguageName = decodeURIComponent(languageName)
    .replace(/-and-/g, " & ")
    .replace(/-/g, " ");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        console.log(`Fetching categories for language: ${decodedLanguageName}`);
        const response = await fetch(
          `${API_BASE}/api/languages/${encodeURIComponent(
            decodedLanguageName
          )}/categories`
        );
        const text = await response.text();
        console.log(
          `Categories response for ${decodedLanguageName}:`,
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
    };
    fetchCategories();
  }, [decodedLanguageName]);

  // Helper function to format URL names
  const formatUrlName = (name) => {
    return encodeURIComponent(
      name.toLowerCase().replace(/ & /g, "-and-").replace(/ /g, "-")
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">
          Categories for {decodedLanguageName}
        </h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {loading && <p className="text-gray-400 mb-4">Loading...</p>}

        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition mb-8"
        >
          Back to Home
        </Link>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Categories</h2>
          {categories.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-400">
              No categories available for {decodedLanguageName}. Check back
              later.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/languages/${formatUrlName(
                    decodedLanguageName
                  )}/categories/${formatUrlName(cat.name)}/snippets`}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 flex justify-between items-center hover:bg-slate-700/50 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 flex items-center justify-center rounded mr-4 bg-gradient-to-br from-blue-500 to-purple-600">
                      <Code2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold">{cat.name}</span>
                      <p className="text-gray-400 text-sm">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-400">
                    <span className="text-sm font-medium">View snippets</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LanguageCategoriesPage;
