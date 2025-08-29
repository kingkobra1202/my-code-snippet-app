import React from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const CategorySnippetListPage = () => {
  const { name, categoryName } = useParams();

  // Static data for snippets
  const snippets = [
    {
      id: "react-login-1",
      language: "react",
      category: "login-pages",
      title: "Simple Login Form",
      description: "A minimal login form with email and password fields.",
      image: "https://placehold.co/400x200/2f3a4b/ffffff?text=Login+1",
    },
    {
      id: "react-login-2",
      language: "react",
      category: "login-pages",
      title: "Login Page with Animation",
      description: "A login form with smooth animations.",
      image: "https://placehold.co/400x200/2f3a4b/ffffff?text=Login+2",
    },
    {
      id: "react-login-3",
      language: "react",
      category: "login-pages",
      title: "Simple React Login",
      description: "A basic React login component.",
      image: "https://placehold.co/400x200/2f3a4b/ffffff?text=Login+3",
    },
    {
      id: "react-login-4",
      language: "react",
      category: "login-pages",
      title: "Login Form with Validation",
      description: "A login form with client-side validation.",
      image: "https://placehold.co/400x200/2f3a4b/ffffff?text=Login+4",
    },
    {
      id: "react-dashboard-1",
      language: "react",
      category: "dashboards",
      title: "Minimalist Dashboard",
      description: "A clean dashboard layout.",
      image: "https://placehold.co/400x200/2f3a4b/ffffff?text=Dashboard+1",
    },
    {
      id: "html-button-1",
      language: "html-css",
      category: "buttons",
      title: "Animated Gradient Button",
      description: "A button with gradient hover effect.",
      image: "https://placehold.co/400x200/2f3a4b/ffffff?text=Button+1",
    },
  ];

  const filteredSnippets = snippets.filter(
    (snippet) => snippet.language === name && snippet.category === categoryName
  );

  const categoryTitle = categoryName.replace(/-/g, " ");

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSnippets.map((snippet) => (
          <Link
            key={snippet.id}
            to={`/languages/${name}/${categoryName}/${snippet.id}`}
            className="cursor-pointer group relative overflow-hidden bg-gray-800 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <img
              src={snippet.image}
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
    </div>
  );
};

export default CategorySnippetListPage;
