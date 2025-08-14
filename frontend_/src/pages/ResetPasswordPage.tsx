import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth";

export default function ResetPasswordPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!uid || !token) return setError("Invalid reset link");

    try {
      const res = await resetPassword({ password }, parseInt(uid), token);
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {message && <p className="bg-green-700 p-2 rounded mb-4">{message}</p>}
        {error && <p className="bg-red-700 p-2 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded font-bold">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
