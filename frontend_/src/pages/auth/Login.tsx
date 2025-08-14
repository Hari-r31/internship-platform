import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login({ username, password });

    if (result.ok) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.profile?.role === "student") navigate("/internships/");
        else if (user.profile?.role === "recruiter") navigate("/internships/");
        else navigate("/");
      }
    } else {
      setError(result.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navbar stays fixed at top */}
      <Navbar />

      {/* Centered login form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />

  {/* Forgot Password Link */}
  <div className="text-right">
    <Link
      to="/forgot-password/"
      className="text-blue-400 hover:underline text-sm"
    >
      Forgot Password?
    </Link>
  </div>

  {error && <p className="text-red-400">{error}</p>}

  <button
    type="submit"
    disabled={loading}
    className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {loading ? "Logging in..." : "Login"}
  </button>
</form>


          <p className="text-sm text-gray-400 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register here
            </Link>
          </p>
          
        </div>
      </div>
    </div>
  );
}
