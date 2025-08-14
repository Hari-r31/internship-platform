import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext"; // import auth context

type Props = {
  internship: {
    id: number;
    title: string;
    company: string;
    location?: string;
    type: string;
    duration: string;
    description: string;
    bookmarked?: boolean; // optional, in case not provided
  };
};

export default function InternshipCard({ internship }: Props) {
  const {
    id,
    title,
    company,
    location = "Remote",
    type,
    duration,
    description,
  } = internship;

  const { user } = useAuth(); // get logged in user
  const [bookmarked, setBookmarked] = useState(internship.bookmarked ?? false);


  const shortDesc =
    description.length > 170 ? description.slice(0, 167) + "..." : description;

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

  return (
    <div className="relative bg-gray-900 rounded-xl shadow-lg p-6 text-white hover:scale-[1.02] transition transform">
      {/* ✅ Only show bookmark button if logged in as student */}
      {user?.profile?.role === "student" && (
        <button
          onClick={toggleBookmark}
          className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-xl"
          title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
        >
          {bookmarked ? "★" : "☆"}
        </button>
      )}

      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-300 mb-2">{company} • {location}</p>
      <p className="text-sm text-gray-400 mb-2">{type} • {duration}</p>
      <p className="text-sm text-gray-200 mb-4">{shortDesc}</p>
      <Link
        to={`/internships/${id}/view/`}
        className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded hover:opacity-90 text-sm"
      >
        View Details
      </Link>
    </div>
  );
}
