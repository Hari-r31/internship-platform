import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function InternshipDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<any>(null);
  const [error, setError] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await api.get(`/internships/${id}/view/`);
        setInternship(data);

        // Check if already applied
        const applyCheck = await api.get(`/applications/check/${id}/`);
        setAlreadyApplied(applyCheck.data.applied);

        // Check if bookmarked
        const bookmarkCheck = await api.get(`/bookmarks/check/${id}/`);
        setBookmarked(bookmarkCheck.data.bookmarked);
      } catch (_) {
        setError("Failed to load internship.");
      }
    };

    fetchInternship();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;
    try {
      await api.delete(`/internships/${id}/edit/`);
      navigate("/internships/mine");
    } catch (_) {
      alert("Failed to delete internship.");
    }
  };

  const handleEdit = () => {
    navigate(`/internships/${id}/edit`);
  };

  const handleApply = async () => {
    try {
      await api.post(`/applications/apply/${internship.id}/`, {});
      alert("Application submitted successfully!");
      setAlreadyApplied(true);
    } catch (error: any) {
      if (error.response?.data) {
        alert(Object.values(error.response.data).join("\n"));
      } else {
        alert("Failed to submit application.");
      }
    }
  };

  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/${internship.id}/remove/`);
        setBookmarked(false);
      } else {
        await api.post(`/bookmarks/${internship.id}/add/`);
        setBookmarked(true);
      }
    } catch (_) {
      alert("Failed to update bookmark.");
    }
  };

  if (!internship) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
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
            <a href={internship.apply_link} target="_blank" rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-500">
              External Apply Link
            </a>
          </p>
        )}

        {canApply && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleApply}
              disabled={alreadyApplied}
              className={`px-4 py-2 rounded ${alreadyApplied
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {alreadyApplied ? "Already Applied" : "Apply Now"}
            </button>

            <button
              onClick={toggleBookmark}
              className={`px-4 py-2 rounded ${bookmarked
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {bookmarked ? "Remove Bookmark" : "Bookmark"}
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
