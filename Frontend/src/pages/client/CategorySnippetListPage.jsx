import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Code2, ChevronRight } from "lucide-react";

const CategorySnippetListPage = () => {
  const { name, categoryName } = useParams();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Decode URL parameters
  const decodedLanguageName = decodeURIComponent(name)
    .replace(/-and-/g, " & ")
    .replace(/-/g, " ");
  const decodedCategoryName = decodeURIComponent(categoryName)
    .replace(/-and-/g, " & ")
    .replace(/-/g, " ");

  useEffect(() => {
    const fetchSnippets = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:3001/api/languages/${encodeURIComponent(
            decodedLanguageName
          )}/categories/${encodeURIComponent(decodedCategoryName)}/snippets`
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to load snippets");
        setSnippets(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, [decodedLanguageName, decodedCategoryName]);

  const formatUrlName = (name) => {
    return encodeURIComponent(
      name.toLowerCase().replace(/ & /g, "-and-").replace(/ /g, "-")
    );
  };

  return (
    <div className="min-h-screen bg-gray-800 font-inter text-gray-200 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Snippets for {decodedCategoryName} in {decodedLanguageName}
        </h1>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {loading && (
          <p className="text-gray-400 text-center mb-4">Loading snippets...</p>
        )}
        {snippets.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-400">No snippets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <Link
                key={snippet._id}
                to={`/languages/${formatUrlName(
                  decodedLanguageName
                )}/categories/${formatUrlName(decodedCategoryName)}/snippets/${
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

export default CategorySnippetListPage;
