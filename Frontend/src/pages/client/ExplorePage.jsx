import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, ChevronRight } from "lucide-react";

const ExplorePage = () => {
  const [snippets, setSnippets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ language: "", category: "" });
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch languages
        const langResponse = await fetch("http://localhost:3001/api/languages");
        const langData = await langResponse.json();
        if (!langResponse.ok)
          throw new Error(langData.error || "Failed to load languages");
        setLanguages(langData);

        // Fetch categories
        const catResponse = await fetch(
          "http://localhost:3001/api/languages/react/categories"
        );
        const catData = await catResponse.json();
        if (!catResponse.ok)
          throw new Error(catData.error || "Failed to load categories");
        setCategories(catData);

        // Fetch snippets
        const snippetsResponse = await fetch(
          `http://localhost:3001/api/snippets?sortBy=${sortBy}${
            filters.language ? `&language=${filters.language}` : ""
          }${filters.category ? `&category=${filters.category}` : ""}`
        );
        const snippetsData = await snippetsResponse.json();
        if (!snippetsResponse.ok)
          throw new Error(snippetsData.error || "Failed to load snippets");
        setSnippets(snippetsData);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortBy, filters.language, filters.category]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Helper function to format URL names
  const formatUrlName = (name) => {
    return encodeURIComponent(
      name.toLowerCase().replace(/ & /g, "-and-").replace(/ /g, "-")
    );
  };

  return (
    <div className="min-h-screen bg-gray-800 font-inter text-gray-200 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Explore Snippets
        </h1>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {loading && (
          <p className="text-gray-400 text-center mb-4">Loading snippets...</p>
        )}

        {/* Filters and Sorting */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <select
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              className="p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang._id} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-400"
          >
            <option value="recent">Most Recent</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {/* Snippets List */}
        {snippets.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-400">No snippets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <Link
                key={snippet._id}
                to={`/languages/${formatUrlName(
                  snippet.languageName
                )}/categories/${formatUrlName(snippet.categoryName)}/snippets/${
                  snippet._id
                }`}
                className="group bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full mr-4">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {snippet.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {snippet.description}
                    </p>
                  </div>
                </div>
                {snippet.previewImage && (
                  <img
                    src={snippet.previewImage}
                    alt={snippet.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center text-orange-400">
                  <span className="text-sm font-medium">
                    {snippet.languageName} - {snippet.categoryName}
                  </span>
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
