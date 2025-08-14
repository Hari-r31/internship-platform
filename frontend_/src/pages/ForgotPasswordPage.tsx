import React, { useState } from "react";
import { forgotPassword } from "../services/auth";
import Navbar from "../components/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      setMessage(res.message || "Reset link sent successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar fixed at the top */}
      <Navbar />

      {/* Centered form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

          {message && <p className="bg-green-700 p-2 rounded mb-4">{message}</p>}
          {error && <p className="bg-red-700 p-2 rounded mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 rounded font-bold ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
