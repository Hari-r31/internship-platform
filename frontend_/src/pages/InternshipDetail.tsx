import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function InternshipDetail() {
  const [submitting, setSubmitting] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [internship, setInternship] = useState<any>(location.state || null);
  const [error, setError] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch internship info (publicly viewable)
      const internshipRes = await api.get(`/internships/${id}/view/`);
      setInternship(internshipRes.data);

      // Only check application/bookmark if user is authenticated
      if (user) {
        const [applyCheck, bookmarkCheck] = await Promise.all([
          api.get(`/applications/check/${id}/`),
          api.get(`/bookmarks/check/${id}/`)
        ]);
        setAlreadyApplied(applyCheck.data.applied);
        setBookmarked(bookmarkCheck.data.bookmarked);
      }
    } catch (_) {
      setError("Failed to load internship.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, user]);



  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;
    try {
      await api.delete(`/internships/${id}/edit/`);
      navigate("/internships/mine");
    } catch {
      alert("Failed to delete internship.");
    }
  };

  const handleEdit = () => {
    navigate(`/internships/${id}/edit`);
  };

  const handleApply = async () => {
    setSubmitting(true);
    try {
      await api.post(`/applications/apply/${internship.id}/`, {});
      setAlreadyApplied(true);
    } catch (error: any) {
      if (error.response?.data) {
        alert(Object.values(error.response.data).join("\n"));
      } else {
        alert("Failed to submit application.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBookmark = async () => {
    // Optimistic update
    setBookmarked((prev) => !prev);
    setBookmarkLoading(true);

    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/${internship.id}/remove/`);
      } else {
        await api.post(`/bookmarks/${internship.id}/add/`);
      }
    } catch {
      alert("Failed to update bookmark.");
      setBookmarked((prev) => !prev); // revert if fail
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading && !internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/5 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-6"></div>
          <div className="h-24 bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-800 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        {error || "Internship not found."}
      </div>
    );
  }

  const isOwner = user?.id === internship.recruiter;
  const canApply = user?.profile?.role === "student" && !isOwner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-300 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-4">{internship.title}</h1>
        <p className="text-gray-300 mb-2"><strong>Company:</strong> {internship.company}</p>
        <p className="text-gray-300 mb-2"><strong>Location:</strong> {internship.location}</p>
        <p className="text-gray-400 mb-2"><strong>Type:</strong> {internship.internship_type}</p>
        <p className="text-gray-400 mb-2"><strong>Stipend:</strong> ₹{internship.stipend || "Not disclosed"}</p>
        <p className="text-gray-500 mb-2"><strong>Status:</strong> {internship.status}</p>
        <p className="text-gray-500 mb-2"><strong>Posted On:</strong> {new Date(internship.posted_on).toLocaleDateString()}</p>
        {internship.expiry_date && (
          <p className="text-gray-500 mb-2"><strong>Expiry Date:</strong> {new Date(internship.expiry_date).toLocaleDateString()}</p>
        )}
        <p className="text-sm text-gray-200 mb-6 whitespace-pre-wrap">
          <strong>Description:</strong> {internship.description}
        </p>

        {internship.apply_link && (
          <p className="text-sm text-gray-400 mb-6">
            <a
              href={internship.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-500"
            >
              External Apply Link
            </a>
          </p>
        )}

        {canApply && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleApply}
              disabled={alreadyApplied || submitting}
              className={`px-4 py-2 rounded ${
                alreadyApplied || submitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {submitting
                ? "Applying…"
                : alreadyApplied
                ? "Already Applied"
                : "Apply Now"}
            </button>

            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`px-4 py-2 rounded ${
                bookmarked
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {bookmarkLoading
                ? "Updating…"
                : bookmarked
                ? "Remove Bookmark"
                : "Bookmark"}
            </button>
          </div>
        )}

        {isOwner && (
          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => navigate(`/internships/${internship.id}/applicants`)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Applicants
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
