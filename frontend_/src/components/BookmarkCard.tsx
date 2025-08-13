
import { Link } from "react-router-dom";
import api from "../services/api";

type Props = {
  bookmark: {
    id: number;
    internship: number; // only ID is provided
    internship_title: string;
    internship_company: string;
    internship_location?: string;
    bookmarked_on?: string;
  };
  onRemove: (id: number) => void;
};

export default function BookmarkCard({ bookmark, onRemove }: Props) {
  const {
    id,
    internship,
    internship_title,
    internship_company,
    internship_location = "Remote",
    bookmarked_on,
  } = bookmark;

  const handleRemove = async () => {
    try {
      await api.delete(`/bookmarks/${internship}/remove/`);
      onRemove(id);
    } catch (_) {
      alert("Failed to remove bookmark.");
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-xl shadow-lg p-6 text-white hover:scale-[1.02] transition transform">
      <h3 className="text-xl font-semibold mb-1">{internship_title}</h3>
      <p className="text-sm text-gray-300 mb-2">
        {internship_company} • {internship_location}
      </p>
      <p className="text-sm text-gray-200 mb-4">
        No detailed description available
      </p>
      {bookmarked_on && (
        <p className="text-xs text-gray-500 mb-2">
          Bookmarked on: {new Date(bookmarked_on).toLocaleDateString()}
        </p>
      )}
      <div className="flex justify-between items-center mt-4">
        <Link
          to={`/internships/${internship}/view`}
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded hover:opacity-90 text-sm"
        >
          View Details
        </Link>
        <button
          onClick={handleRemove}
          className="text-sm text-red-400 hover:text-red-300 px-3 py-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
