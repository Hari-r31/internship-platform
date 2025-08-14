import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar"; // Added Navbar

export default function EditInternshipPage() {
  const { id } = useParams();
  const { user: _user } = useAuth();
  const navigate = useNavigate();

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

  const [originalData, setOriginalData] = useState(form); // store original fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await api.get(`/internships/${id}/view/`);
        setForm({
          title: data.title,
          description: data.description,
          company: data.company,
          location: data.location,
          stipend: data.stipend,
          internship_type: data.internship_type,
          apply_link: data.apply_link,
          expiry_date: data.expiry_date || "",
          status: data.status,
        });
        setOriginalData({
          title: data.title,
          description: data.description,
          company: data.company,
          location: data.location,
          stipend: data.stipend,
          internship_type: data.internship_type,
          apply_link: data.apply_link,
          expiry_date: data.expiry_date || "",
          status: data.status,
        });
      } catch (_) {
        setError("Failed to load internship.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const formattedData = {
        ...form,
        expiry_date: form.expiry_date
          ? new Date(form.expiry_date).toISOString().split("T")[0] // YYYY-MM-DD
          : null,
      };

      await api.patch(`/internships/${id}/edit/`, formattedData);
      setSuccess(true);
      setTimeout(() => navigate("/internships/mine"), 1500);
    } catch (err: any) {
      if (err?.response?.data) {
        const errorMsg =
          typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data);
        setError(errorMsg);
      } else {
        setError("Failed to update internship.");
      }
    }
  };

  const handleDiscard = () => {
    setForm(originalData); // Reset form to original data
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6 py-12">
      <Navbar /> {/* Navbar added */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Internship</h1>
          <button
            onClick={handleBack}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800"
          >
            ← Back
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {success && <p className="text-green-400 mb-4">Internship updated successfully!</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
          <input
            name="stipend"
            placeholder="Stipend"
            type="number"
            value={form.stipend}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
          <select
            name="internship_type"
            value={form.internship_type}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded"
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
            className="bg-gray-800 text-white px-4 py-2 rounded"
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
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
          <input
            name="apply_link"
            placeholder="Apply Link"
            value={form.apply_link}
            onChange={handleChange}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="bg-gray-800 text-white px-4 py-2 rounded w-full h-32 mt-4"
        />

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            onClick={handleDiscard}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
