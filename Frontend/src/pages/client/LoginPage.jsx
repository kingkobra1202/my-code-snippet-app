import React, { useState, useEffect } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

const API_BASE = import.meta.env.VITE_API_URL;

// Google Icon SVG component
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 48 48"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.37 1.49 7.84 2.74l5.68-5.54C33.17 3.47 28.88 1.5 24 1.5 14.74 1.5 7.04 7.95 4.23 16.19l6.85 5.3C12.52 14.5 17.73 9.5 24 9.5z"
    />
    <path
      fill="#34A853"
      d="M46.48 24.5c0-1.57-.14-3.08-.39-4.53H24v9.06h12.68c-.55 2.9-2.19 5.36-4.67 7.02l7.52 5.83C43.95 38.3 46.48 31.8 46.48 24.5z"
    />
    <path
      fill="#4A90E2"
      d="M10.96 28.36c-.65-1.9-1.02-3.94-1.02-6.06s.37-4.16 1.02-6.06l-6.85-5.3C1.97 14.8 1.5 19.5 1.5 24s.47 9.2 2.61 13.06l6.85-5.3z"
    />
    <path
      fill="#FBBC05"
      d="M24 46.5c5.88 0 10.95-1.94 14.6-5.28l-7.52-5.83c-2.05 1.38-4.7 2.2-7.08 2.2-6.27 0-11.48-5-12.92-11.49l-6.85 5.3C7.04 40.05 14.74 46.5 24 46.5z"
    />
  </svg>
);

/* ===== SHARED FORM STYLES ===== */
const inputClasses =
  "w-full p-3 pl-10 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 shadow-sm";
const iconClasses =
  "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none";
const buttonClasses =
  "w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2";

/* LOGIN FORM COMPONENT */
const LoginForm = ({
  formData,
  setFormData,
  error,
  setError,
  success,
  setSuccess,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("${API_BASE}/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          navigate(data.role === "admin" ? "/admin" : "/");
        }, 1000);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-full max-w-sm p-4"
    >
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 font-display">
        Sign In
      </h2>
      <button
        type="button"
        className="w-full py-3 px-4 bg-gray-100 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mb-6"
        onClick={() => alert("Google Sign-In not implemented yet")}
      >
        <GoogleIcon /> <span>Sign in with Google</span>
      </button>
      <span className="text-sm text-gray-400 mb-6">or use your account</span>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
      <div className="relative w-full mb-4">
        <User size={20} className={iconClasses} />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className={inputClasses}
        />
      </div>
      <div className="relative w-full mb-4">
        <Lock size={20} className={iconClasses} />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={inputClasses}
        />
      </div>
      <a
        href="#"
        className="text-xs text-gray-500 hover:underline mb-6 self-end"
        onClick={() => alert("Forgot password not implemented yet")}
      >
        Forgot your password?
      </a>
      <button type="submit" className={buttonClasses}>
        Sign In <ArrowRight size={18} />
      </button>
    </form>
  );
};

/* REGISTER FORM COMPONENT */
const RegisterForm = ({
  formData,
  setFormData,
  error,
  setError,
  success,
  setSuccess,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("${API_BASE}/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          navigate(data.role === "admin" ? "/admin" : "/");
        }, 1000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-full max-w-sm p-4"
    >
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 font-display">
        Create Account
      </h2>
      <button
        type="button"
        className="w-full py-3 px-4 bg-gray-100 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mb-6"
        onClick={() => alert("Google Sign-Up not implemented yet")}
      >
        <GoogleIcon /> <span>Sign up with Google</span>
      </button>
      <span className="text-sm text-gray-400 mb-6">or use your email</span>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
      <div className="relative w-full mb-4">
        <User size={20} className={iconClasses} />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className={inputClasses}
        />
      </div>
      <div className="relative w-full mb-4">
        <Mail size={20} className={iconClasses} />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClasses}
        />
      </div>
      <div className="relative w-full mb-4">
        <Lock size={20} className={iconClasses} />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={inputClasses}
        />
      </div>
      <button type="submit" className={buttonClasses}>
        Sign Up <ArrowRight size={18} />
      </button>
    </form>
  );
};

// Main Login/Registration Page
const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Prevent back navigation if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const role = getRole();
      navigate(role === "admin" ? "/admin" : "/");
    }
  }, [navigate]);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-sans light-theme">
      <div className="relative w-full max-w-4xl min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        <div
          className={`absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center p-10 transition-all duration-700 ease-in-out transform
              ${
                isLogin
                  ? "translate-x-0 opacity-100 scale-y-100"
                  : "-translate-x-full opacity-0 scale-y-0"
              }`}
        >
          <LoginForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
          />
        </div>
        <div
          className={`absolute top-0 left-1/2 h-full w-1/2 flex flex-col items-center justify-center p-10 transition-all duration-700 ease-in-out transform
              ${
                isLogin
                  ? "translate-x-full opacity-0 scale-y-0"
                  : "translate-x-0 opacity-100 scale-y-100"
              }`}
        >
          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
          />
        </div>
        <div
          className={`absolute top-0 left-0 h-full w-1/2 text-white flex flex-col 
              items-center justify-center p-10 text-center transition-transform duration-700 ease-in-out z-20 rounded-l-3xl shadow-lg
              ${
                isLogin
                  ? "translate-x-full rounded-r-3xl"
                  : "translate-x-0 rounded-l-3xl"
              } overlay-glow`}
          style={{
            background: "linear-gradient(135deg, #1e293b, #0369a1)",
          }}
        >
          <h2 className="text-4xl font-extrabold mb-4 font-display">
            {isLogin ? "Hello, Coder!" : "Welcome Back!"}
          </h2>
          <p className="text-sm font-light leading-relaxed max-w-sm mb-8">
            {isLogin
              ? "Start coding your journey with us."
              : "Keep building with us. Log in with your details."}
          </p>
          <button
            onClick={handleToggleForm}
            className="px-8 py-3 bg-transparent text-white border-2 border-white font-bold text-sm rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-indigo-900"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
      <style>
        {`
            .light-theme {
              background-color: #f0f2f5;
              color: #1f2937;
              position: relative;
              overflow: hidden;
            }
            .light-theme::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: 
                linear-gradient(rgba(128, 0, 128, 0.02), rgba(128, 0, 128, 0.02)),
                repeating-linear-gradient(90deg, #e5e5e5, #e5e5e5 1px, transparent 1px, transparent 30px),
                repeating-linear-gradient(180deg, #e5e5e5, #e5e5e5 1px, transparent 1px, transparent 30px);
              background-size: 100% 100%;
              z-index: -1;
              opacity: 0.8;
              animation: scanlines 10s linear infinite;
            }
            @keyframes scanlines {
              0% { background-position: 0 0; }
              100% { background-position: 0 100%; }
            }
            .overlay-glow {
              box-shadow: 0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 10px rgba(0, 255, 0, 0.1);
            }
            `}
      </style>
    </div>
  );
};

export default LoginPage;
