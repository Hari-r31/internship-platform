import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Adjust the import based on your project structure
import Navbar from "../../components/Navbar";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false); // add this

  const handleSubmit = async () => {
    setLoading(true); // start loading
    setError("");     // clear previous errors
    try {
      await api.post("/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
        profile: { role: form.role },
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false); // stop loading
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      {/* Navbar fixed at top */}
      <Navbar />

      {/* Centered form */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

          {error && <p className="text-red-400 mb-4">{error}</p>}
          {success && <p className="text-green-400 mb-4">Registered successfully! Redirecting…</p>}

          <div className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full text-white px-4 py-2 rounded transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering!" : "Register"}
          </button>
          <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Already have an account? Login
        </button>
        </div>
      </div>
    </div>
  );
}
