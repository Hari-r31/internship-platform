import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Gets logged-in user info
import InternshipCard from "../components/InternshipCard"; // Component to display each internship
import Navbar from "../components/Navbar";
import api from "../services/api"; // Axios instance for making API calls

export default function InternshipList() {
  // Auth context
  const { user, loading: authLoading } = useAuth();

  // State variables
  const [internships, setInternships] = useState([]); // Stores fetched internships
  const [loading, setLoading] = useState(true);       // Loading state
  const [error, setError] = useState("");             // Error message
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    duration: "",
    tech: "",
    tags: "",
  });
  const [sortByDate, setSortByDate] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);                // Current page number
  const [totalPages, setTotalPages] = useState(1);    // Total pages from backend

  // Fetch data whenever the page changes
  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        // API call to backend endpoint `/internships/?page=${page}`
        // This should return paginated internships
        const { data } = await api.get(`/internships/?page=${page}`);

        // See exactly what the backend returns
        console.log("Raw API response from backend:", data);

        // Common patterns for backend data:
        // - `data.results` → paginated list of internships
        // - `data.total_pages` → total number of pages
        setInternships(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to load internships.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [page]);

  // Apply search filters
  const filtered = internships.filter((i) => {
  return (
    (!filters.location || i.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
    (!filters.type || i.type?.toLowerCase().includes(filters.type.toLowerCase())) &&
    (!filters.duration || i.duration?.toLowerCase().includes(filters.duration.toLowerCase())) &&
    (!filters.tech || i.tech_stack?.join(",").toLowerCase().includes(filters.tech.toLowerCase())) &&
    (!filters.tags || i.tags?.join(",").toLowerCase().includes(filters.tags.toLowerCase()))
  );
});


  // Sort by date
  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortByDate === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Show a loading screen while user auth is still loading
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
        <h1 className="text-3xl font-bold mb-6">Available Internships</h1>

        {/* Filters */}
        <div className="mb-6 grid md:grid-cols-3 gap-4">
          <input type="text" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="bg-gray-800 text-white px-4 py-2 rounded" />
          <input type="text" placeholder="Type (e.g. Full-time)" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="bg-gray-800 text-white px-4 py-2 rounded" />
          <input type="text" placeholder="Duration (e.g. 3 months)" value={filters.duration} onChange={(e) => setFilters({ ...filters, duration: e.target.value })} className="bg-gray-800 text-white px-4 py-2 rounded" />
          <input type="text" placeholder="Tech Stack (e.g. React, Django)" value={filters.tech} onChange={(e) => setFilters({ ...filters, tech: e.target.value })} className="bg-gray-800 text-white px-4 py-2 rounded" />
          <input type="text" placeholder="Tags (e.g. remote, paid)" value={filters.tags} onChange={(e) => setFilters({ ...filters, tags: e.target.value })} className="bg-gray-800 text-white px-4 py-2 rounded" />
        </div>

        {/* Sort dropdown */}
        <div className="mb-4 flex justify-end">
          <select value={sortByDate} onChange={(e) => setSortByDate(e.target.value as "newest" | "oldest")} className="bg-gray-800 text-white px-4 py-2 rounded">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Internship Grid */}
        {loading ? (
          <p className="text-gray-400">Loading internships…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : sorted.length === 0 ? (
          <p className="text-gray-400">No internships found.</p>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(345px, 1fr))" }}>
            {sorted.map((internship: any) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-4">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">Previous</button>
          <span className="text-white">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 InternLink. All rights reserved.
      </footer>
    </div>
  );
}
