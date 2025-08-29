import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Loader2, Frown } from "lucide-react";

const CategorySnippetListPage = () => {
  const { name, categoryName } = useParams();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        setError(null);
        // Correctly handle encoded URLs by decoding them
        const decodedLanguageName = decodeURIComponent(name);
        const decodedCategoryName = decodeURIComponent(categoryName);

        // Fetch data from your backend API
        const response = await fetch(
          `http://localhost:3001/api/languages/${decodedLanguageName}/categories/${decodedCategoryName}/snippets`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch snippets.");
        }

        const data = await response.json();
        setSnippets(data);
      } catch (err) {
        console.error("Fetch snippets error:", err);
        setError("Failed to load snippets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [name, categoryName]);

  const categoryTitle = decodeURIComponent(categoryName).replace(/-/g, " ");

  // Render different states based on data fetching status
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 font-inter text-gray-200">
        <Loader2 className="animate-spin h-12 w-12 text-teal-400 mb-4" />
        <p className="text-xl">Loading snippets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 font-inter text-gray-200">
        <Frown className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-xl text-center">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure your backend server is running.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 font-inter text-gray-200">
      <div className="max-w-7xl mx-auto mb-8 text-center">
        {/* Updated heading with a new gradient */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2 capitalize">
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            {categoryTitle}
          </span>
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          Browse and select a snippet to view its code and details.
        </p>
      </div>

      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-2xl max-w-lg mx-auto text-center shadow-lg">
          <Frown className="h-16 w-16 text-yellow-500 mb-4" />
          <p className="text-xl font-semibold text-white mb-2">
            No Snippets Found
          </p>
          <p className="text-gray-400">
            It looks like there are no snippets for this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <Link
              key={snippet._id}
              to={`/languages/${name}/${categoryName}/${snippet._id}`}
              className="cursor-pointer group relative overflow-hidden bg-gray-800 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={
                  snippet.previewImage ||
                  "https://placehold.co/400x200/2f3a4b/ffffff?text=Image+Not+Available"
                }
                alt={snippet.title}
                className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/400x200/2f3a4b/ffffff?text=Image+Not+Available")
                }
              />
              <h3 className="text-xl font-semibold text-white mb-2">
                {snippet.title}
              </h3>
              <p className="text-gray-400 text-sm">{snippet.description}</p>
              <div className="mt-4 flex items-center text-teal-400">
                <span className="text-sm font-medium">View Details</span>
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySnippetListPage;
