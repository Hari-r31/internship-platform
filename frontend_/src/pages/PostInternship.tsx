import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function PostInternship() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    stipend: "",
    internship_type: "full-time",
    apply_link: "",
    expiry_date: "",
    status: "open",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    try {
      await api.post("/internships/create/", form);
      setSuccess(true);
      setTimeout(() => navigate("/internships/mine/"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to post internship.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading user info…
      </div>
    );
  }

  // Access restriction
  if (user?.profile?.role !== "recruiter") {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Access restricted: Recruiters only.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Post a New Internship</h1>

        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-500/20 border border-green-400 text-green-300 px-4 py-2 rounded">
            Internship posted successfully!
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="stipend"
            placeholder="Stipend"
            type="number"
            value={form.stipend}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            name="internship_type"
            value={form.internship_type}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
            <option value="on-site">On-site</option>
          </select>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
          <input
            name="expiry_date"
            type="date"
            value={form.expiry_date}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="apply_link"
            placeholder="Apply Link"
            value={form.apply_link}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="bg-gray-800 text-white px-4 py-2 rounded w-full h-32 mt-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Post Internship
        </button>
      </div>

      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} InternLink
      </footer>
    </div>
  );
}
