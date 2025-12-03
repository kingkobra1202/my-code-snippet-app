import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Code2, Zap, Users, ChevronRight, Star, User } from "lucide-react";
import { isAuthenticated, logout } from "../utils/auth";

const HomePage = () => {
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({ snippets: 0, languages: 0, users: 0 });
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(isAuthenticated());

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // ------------------ Fetch languages ------------------
        const langResponse = await fetch("${API_BASE}/api/languages");
        const langText = await langResponse.text();
        console.log("Languages response:", langResponse.status, langText);

        let langData;
        try {
          langData = JSON.parse(langText);
        } catch (e) {
          console.error("Languages parse error:", e.message, langText);
          throw new Error(`Failed to parse languages response: ${e.message}`);
        }

        if (langResponse.ok) {
          setLanguages(
            langData.map((lang) => ({
              id: lang._id,
              name: lang.name,
              icon: <Code2 className="h-8 w-8 text-white" />,
              snippets: `${lang.snippets}+`,
              color: lang.color,
            }))
          );
        } else {
          setError(
            `Failed to load languages: ${
              langData.error || langResponse.statusText
            }`
          );
        }

        // ------------------ Fetch categories ------------------
        const catResponse = await fetch("${API_BASE}/api/categories/popular");
        const catText = await catResponse.text();
        console.log("Categories response:", catResponse.status, catText);

        let catData;
        try {
          catData = JSON.parse(catText);
        } catch (e) {
          console.error("Categories parse error:", e.message, catText);
          throw new Error(`Failed to parse categories response: ${e.message}`);
        }

        if (catResponse.ok) {
          setCategories(catData);
        } else {
          setError(
            `Failed to load categories: ${
              catData.error || catResponse.statusText
            }`
          );
        }

        // ------------------ Fetch stats ------------------
        const statsResponse = await fetch("${API_BASE}/api/stats");
        const statsText = await statsResponse.text();
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
            `Failed to load stats: ${
              statsData.error || statsResponse.statusText
            }`
          );
        }

        // ------------------ Fetch profile (only if logged in) ------------------
        // ------------------ Fetch profile (safe version) ------------------
        const token = localStorage.getItem("token");

        if (token) {
          try {
            const profileResponse = await fetch("${API_BASE}/api/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });

            const profileText = await profileResponse.text();
            console.log(
              "Profile response:",
              profileResponse.status,
              profileText
            );

            let profileData;
            try {
              profileData = JSON.parse(profileText);
            } catch (e) {
              console.error("Profile parse error:", e.message, profileText);
              throw new Error(`Failed to parse profile response: ${e.message}`);
            }

            if (profileResponse.ok) {
              setProfile(profileData);
            } else {
              setError(
                `Failed to load profile: ${
                  profileData.error || profileResponse.statusText
                }`
              );
            }
          } catch (e) {
            console.error("Profile fetch error:", e.message);
            setError(`Error loading profile: ${e.message}`);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // IMPORTANT: refetch only when auth changes
  useEffect(() => {
    const words = ["Code Snippets", "Programming Solutions", "Developer Tools"];
    const timer = setTimeout(
      () => {
        const currentWord = words[textIndex % words.length];
        if (!isDeleting) {
          setTypedText(currentWord.substring(0, typedText.length + 1));
          if (typedText === currentWord) {
            setTimeout(() => setIsDeleting(true), 1000);
          }
        } else {
          setTypedText(currentWord.substring(0, typedText.length - 1));
          if (typedText === "") {
            setIsDeleting(false);
            setTextIndex(textIndex + 1);
          }
        }
      },
      isDeleting ? 50 : 100
    );
    return () => clearTimeout(timer);
  }, [typedText, textIndex, isDeleting]);

  // Helper function to format URL names
  const formatUrlName = (name) => {
    return encodeURIComponent(
      name.toLowerCase().replace(/ & /g, "-and-").replace(/ /g, "-")
    );
  };

  return (
    <div className="min-h-screen bg-gray-800 font-inter text-gray-200 relative overflow-hidden">
      <nav className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-sm z-50 py-4 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">CodeSnippet</h1>
          <div className="flex items-center gap-4">
            {!isAuthenticated() ? (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border-2 border-gray-500 text-gray-300 rounded-full font-semibold hover:border-pink-400 hover:text-pink-400 transition-all duration-300"
              >
                Join Community
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfilePopup(!showProfilePopup)}
                  className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-all"
                >
                  <User className="h-6 w-6" />
                  <span>{profile?.username || "Profile"}</span>
                </button>
                {showProfilePopup && profile && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-700 rounded-lg shadow-xl p-4 text-gray-200 z-50">
                    <h3 className="text-lg font-semibold mb-2">
                      {profile.username}
                    </h3>
                    <p className="text-sm mb-1">
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Role:</strong> {profile.role}
                    </p>
                    <p className="text-sm mb-4">
                      <strong>Joined:</strong>{" "}
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={logout}
                      className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <section className="relative overflow-hidden py-28 px-4 sm:px-6 lg:px-8 bg-gray-900 shadow-xl pt-20">
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Welcome to CodeSnippet
            </span>
          </h1>
          <div className="text-2xl md:text-3xl text-gray-300 mb-8 font-semibold">
            Discover{" "}
            <span className="text-pink-400 font-bold">{typedText}</span>
            <span className="animate-pulse text-pink-400">|</span>
          </div>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Access thousands of curated code snippets across multiple languages.
            Learn, share, and build faster with our community-driven platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explore"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full font-bold shadow-lg hover:from-orange-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Explore Snippets
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
          {loading && (
            <p className="text-gray-400 text-center mt-4">Loading...</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-gray-700/50 rounded-2xl shadow-inner">
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-400 mb-2">
                {Math.floor(stats.snippets)}+
              </div>
              <div className="text-gray-400 uppercase tracking-widest text-sm">
                Code Snippets
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">
                {Math.floor(stats.languages)}+
              </div>
              <div className="text-gray-400 uppercase tracking-widest text-sm">
                Languages
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-pink-400 mb-2">
                {Math.floor(stats.users)}+
              </div>
              <div className="text-gray-400 uppercase tracking-widest text-sm">
                Active Users
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Browse by Language
          </h2>
          {languages.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-400">
              No languages available. Please check back later.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {languages.map((lang) => (
                <Link
                  key={lang.id}
                  to={`/languages/${formatUrlName(lang.name)}/categories`}
                  className={`group relative overflow-hidden bg-gray-700 rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  onClick={() =>
                    console.log(
                      `Navigating to /languages/${formatUrlName(
                        lang.name
                      )}/categories`
                    )
                  }
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${lang.color} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                  ></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      {lang.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {lang.name}
                    </h3>
                    <div className="flex items-center text-orange-400">
                      <span className="text-sm font-medium">
                        Explore {lang.snippets} snippets
                      </span>
                      <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Popular Categories
          </h2>
          {categories.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-400">
              No categories available. Please check back later.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  to={`/languages/${formatUrlName(
                    category.languageName
                  )}/categories/${formatUrlName(category.name)}/snippets`}
                  className="group relative overflow-hidden bg-gray-700 rounded-xl p-6 text-left shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute top-4 right-4">
                    <Star className="h-5 w-5 text-orange-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-teal-400">
                    <span className="text-sm font-medium">
                      {category.snippetCount} snippets
                    </span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Choose CodeSnippet?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-700 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mb-4 shadow-xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-400">
                Instant access to thousands of code snippets.
              </p>
            </div>
            <div className="text-center bg-gray-700 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 shadow-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Community Driven
              </h3>
              <p className="text-gray-400">
                Curated by developers for developers.
              </p>
            </div>
            <div className="text-center bg-gray-700 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-full mb-4 shadow-xl">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Always Updated
              </h3>
              <p className="text-gray-400">
                Latest snippets for modern frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
