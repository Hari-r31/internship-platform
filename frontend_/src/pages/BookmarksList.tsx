import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import BookmarkCard from "../components/BookmarkCard";
import api from "../services/api";

export default function Bookmarks() {
  const { loading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
          const { data } = await api.get("/bookmarks/list/");
          console.log("Fetched bookmarks:", data);
          if (data && Array.isArray(data.results)) {
            setBookmarks(data.results);
          } else if (Array.isArray(data)) {
            setBookmarks(data);
          } else {
            setBookmarks([]);
          }
        } catch (_) {
          setError("Unable to fetch applications.");
        } finally {
          setLoading(false);
        }
    };

    fetchBookmarks();
  }, []);

  const handleRemove = (id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading user info…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />
      <div className="px-4 py-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Bookmarked Internships</h1>

        {loading ? (
          <p className="text-gray-400">Loading bookmarks…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : bookmarks.length === 0 ? (
          <p className="text-gray-400">You haven't bookmarked any internships yet.</p>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(345px, 1fr))",
            }}
          >
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 InternLink. All rights reserved.
      </footer>
    </div>
  );
}