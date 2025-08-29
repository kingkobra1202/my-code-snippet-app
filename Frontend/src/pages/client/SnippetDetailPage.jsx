import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Copy, Check, Download, Video, ChevronLeft } from "lucide-react";

const SnippetDetailPage = () => {
  const { name, categoryName, snippetId } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [copied, setCopied] = useState(false);

  // Static data for snippets
  const allSnippets = [
    {
      id: "react-login-1",
      language: "react",
      category: "login-pages",
      title: "Simple Login Form",
      description:
        "A basic login form with email and password fields, and a submit button.",
      code: `import React, { useState } from 'react';\n\nconst SimpleLoginForm = () => {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log('Login attempt with:', { email, password });\n  };\n\n  return (\n    <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-lg shadow-xl">\n      <h2 className="text-2xl font-bold text-white mb-4">Login</h2>\n      <input\n        type="email"\n        placeholder="Email"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"\n      />\n      <input\n        type="password"\n        placeholder="Password"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"\n      />\n      <button type="submit" className="w-full p-2 bg-orange-500 rounded text-white font-bold hover:bg-orange-600 transition-colors">Login</button>\n    </form>\n  );\n};\n\nexport default SimpleLoginForm;`,
      previewImage:
        "https://placehold.co/600x400/2f3a4b/ffffff?text=Login+Form+Demo",
      demoLink: "https://youtube.com/shorts/your-login-form-demo",
    },
    {
      id: "react-login-2",
      language: "react",
      category: "login-pages",
      title: "Login Page with Animation",
      description: "A login form with smooth animations.",
      code: `import React, { useState } from 'react';\n\nconst AnimatedLoginForm = () => {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log('Login attempt with:', { email, password });\n  };\n\n  return (\n    <form onSubmit={handleSubmit} className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl transition-all duration-300">\n      <h2 className="text-2xl font-bold text-white mb-4">Animated Login</h2>\n      <input\n        type="email"\n        placeholder="Email"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 hover:scale-105 transition-transform"\n      />\n      <input\n        type="password"\n        placeholder="Password"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 hover:scale-105 transition-transform"\n      />\n      <button type="submit" className="w-full p-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded text-white font-bold hover:from-orange-500 hover:to-pink-600 transition-colors">Login</button>\n    </form>\n  );\n};\n\nexport default AnimatedLoginForm;`,
      previewImage:
        "https://placehold.co/600x400/2f3a4b/ffffff?text=Login+Animation+Demo",
      demoLink: "https://youtube.com/shorts/your-animated-login-demo",
    },
    {
      id: "react-login-3",
      language: "react",
      category: "login-pages",
      title: "Simple React Login",
      description: "A basic React login component.",
      code: `import React from 'react';\n\nconst SimpleReactLogin = () => {\n  return (\n    <div className="p-8 bg-gray-800 rounded-lg">\n      <h2 className="text-2xl font-bold text-white mb-4">Simple Login</h2>\n      <input type="text" placeholder="Username" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />\n      <button className="w-full p-2 bg-orange-500 rounded text-white">Login</button>\n    </div>\n  );\n};\n\nexport default SimpleReactLogin;`,
      previewImage:
        "https://placehold.co/600x400/2f3a4b/ffffff?text=Simple+Login+Demo",
      demoLink: "https://youtube.com/shorts/your-simple-login-demo",
    },
    {
      id: "react-login-4",
      language: "react",
      category: "login-pages",
      title: "Login Form with Validation",
      description: "A login form with client-side validation.",
      code: `import React, { useState } from 'react';\n\nconst ValidatedLoginForm = () => {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [error, setError] = useState('');\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    if (!email.includes('@')) {\n      setError('Invalid email');\n      return;\n    }\n    if (password.length < 6) {\n      setError('Password must be at least 6 characters');\n      return;\n    }\n    setError('');\n    console.log('Login successful');\n  };\n\n  return (\n    <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-lg shadow-xl">\n      <h2 className="text-2xl font-bold text-white mb-4">Validated Login</h2>\n      {error && <p className="text-red-400 mb-4">{error}</p>}\n      <input\n        type="email"\n        placeholder="Email"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"\n      />\n      <input\n        type="password"\n        placeholder="Password"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"\n      />\n      <button type="submit" className="w-full p-2 bg-orange-500 rounded text-white font-bold hover:bg-orange-600 transition-colors">Login</button>\n    </form>\n  );\n};\n\nexport default ValidatedLoginForm;`,
      previewImage:
        "https://placehold.co/600x400/2f3a4b/ffffff?text=Validated+Login+Demo",
      demoLink: "https://youtube.com/shorts/your-validated-login-demo",
    },
    {
      id: "react-dashboard-1",
      language: "react",
      category: "dashboards",
      title: "Minimalist Dashboard Layout",
      description:
        "A responsive two-column layout for a dashboard with a sidebar and main content area.",
      code: `const DashboardLayout = () => {\n  return (\n    <div className="flex min-h-screen bg-gray-900 text-white">\n      <aside className="w-64 bg-gray-800 p-4">\n        <h1 className="text-xl font-bold">Dashboard</h1>\n        <nav className="mt-4">\n          <ul>\n            <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Home</a></li>\n            <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Analytics</a></li>\n            <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Settings</a></li>\n          </ul>\n        </nav>\n      </aside>\n      <main className="flex-1 p-8">\n        <header className="mb-8">\n          <h2 className="text-3xl font-bold">Welcome back!</h2>\n        </header>\n        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n          <div className="bg-gray-800 p-6 rounded-lg shadow">Card 1</div>\n          <div className="bg-gray-800 p-6 rounded-lg shadow">Card 2</div>\n          <div className="bg-gray-800 p-6 rounded-lg shadow">Card 3</div>\n        </section>\n      </main>\n    </div>\n  );\n};\n\nexport default DashboardLayout;`,
      previewImage:
        "https://placehold.co/600x400/2f3a4b/ffffff?text=Dashboard+Layout+Demo",
      demoLink: "https://youtube.com/shorts/your-dashboard-demo",
    },
    {
      id: "html-button-1",
      language: "html-css",
      category: "buttons",
      title: "Animated Gradient Button",
      description:
        "A button with a subtle hover animation and a gradient background.",
      code: `<style>\n.gradient-button {\n  background: linear-gradient(90deg, #F97316, #EC4899);\n  transition: all 0.3s ease;\n}\n.gradient-button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);\n}\n</style>\n<button class="gradient-button text-white font-bold py-2 px-6 rounded-full">\n  Learn More\n</button>`,
      previewImage:
        "https://placehold.co/600x400/2f3a4b/ffffff?text=Animated+Button+Demo",
      demoLink: "https://youtube.com/shorts/your-button-demo",
    },
  ];

  useEffect(() => {
    const foundSnippet = allSnippets.find(
      (s) =>
        s.id === snippetId && s.language === name && s.category === categoryName
    );
    setSnippet(foundSnippet);
  }, [name, categoryName, snippetId]);

  const handleCopy = (code) => {
    const el = document.createElement("textarea");
    el.value = code;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (code, title) => {
    const filename = `${title.toLowerCase().replace(/ /g, "-")}${
      name === "html-css" ? ".html" : ".js"
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

  if (!snippet) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl bg-gray-900">
        Snippet not found.
      </div>
    );
  }

  const categoryTitle = categoryName.replace(/-/g, " ");

  return (
    <div className="min-h-screen p-8 bg-gray-900 font-inter text-gray-200">
      <div className="max-w-7xl mx-auto">
        <Link
          to={`/languages/${name}/${categoryName}`}
          className="inline-flex items-center text-teal-400 hover:text-teal-300 transition-colors mb-8"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to {categoryTitle}
        </Link>
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
                onClick={() => handleDownload(snippet.code, snippet.title)}
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
