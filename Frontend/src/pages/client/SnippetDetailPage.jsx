import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Copy,
  Check,
  Download,
  Video,
  ChevronLeft,
  Loader2,
  Frown,
} from "lucide-react";

const SnippetDetailPage = () => {
  const { categoryName, snippetId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/api/snippets/${snippetId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch snippet details.");
        }

        const data = await response.json();
        setSnippet(data);
      } catch (err) {
        console.error("Fetch snippet error:", err);
        setError("Failed to load snippet details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [snippetId]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (code, title, language) => {
    const filename = `${title.toLowerCase().replace(/ /g, "-")}${
      language.toLowerCase() === "html-css" ? ".html" : ".js"
    }`;
    const fileContent = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(fileContent);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const categoryTitle = decodeURIComponent(categoryName).replace(/-/g, " ");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 font-inter text-gray-200">
        <Loader2 className="animate-spin h-12 w-12 text-teal-400 mb-4" />
        <p className="text-xl">Loading snippet details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 font-inter text-gray-200">
        <Frown className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-xl text-center">{error}</p>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 font-inter text-gray-200">
        <Frown className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-xl">Snippet not found.</p>
      </div>
    );
  }

  const goBack = () => {
    navigate(-1); // This navigates back one step in the browser history
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 font-inter text-gray-200">
      <div className="max-w-7xl mx-auto">
        <button // Changed from Link to button
          onClick={goBack} // Added onClick handler
          className="inline-flex items-center text-teal-400 hover:text-teal-300 transition-colors mb-8"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to {categoryTitle}
        </button>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 capitalize">
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            {snippet.title}
          </span>
        </h1>
        <p className="text-lg text-gray-400 mb-8">{snippet.description}</p>

        {/* Demo Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-white">Preview</h3>
          <div className="relative bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px] shadow-xl">
            {snippet.previewImage && (
              <img
                src={snippet.previewImage}
                alt="Code Snippet Demo"
                className="w-full h-auto object-contain rounded-xl"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x400/2f3a4b/ffffff?text=Image+Not+Available")
                }
              />
            )}
            {snippet.demoLink && (
              <a
                href={snippet.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 flex items-center px-4 py-2 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors"
              >
                <Video size={18} className="mr-2" />
                <span>Watch Demo</span>
              </a>
            )}
          </div>
        </div>

        {/* Code and Actions Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-white">Code</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleCopy(snippet.code)}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={18} className="mr-2" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} className="mr-2" /> Copy
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  handleDownload(
                    snippet.code,
                    snippet.title,
                    snippet.languageName
                  )
                }
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition-colors"
              >
                <Download size={18} className="mr-2" /> Download
              </button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl overflow-hidden text-sm shadow-xl">
            <pre className="p-4 overflow-x-auto text-gray-200 whitespace-pre-wrap">
              <code>{snippet.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetDetailPage;
