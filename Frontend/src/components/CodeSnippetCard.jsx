import React, { useState } from "react";
import { Copy, Code2 } from "lucide-react";

const CodeSnippetCard = ({ snippet }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(snippet.code)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="p-6 bg-slate-700 rounded-lg shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{snippet.title}</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center px-3 py-1.5 text-sm rounded-md transition-colors duration-200"
        >
          <Copy className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-gray-400">
            {isCopied ? "Copied!" : "Copy Code"}
          </span>
        </button>
      </div>
      <div className="bg-slate-900 p-4 rounded-md overflow-x-auto text-sm text-gray-200 font-mono">
        <pre>{snippet.code}</pre>
      </div>
      <p className="text-gray-400 mt-4 text-sm">{snippet.description}</p>
    </div>
  );
};

export default CodeSnippetCard;
