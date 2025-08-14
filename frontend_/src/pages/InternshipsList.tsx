import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import InternshipCard from "../components/InternshipCard";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function InternshipList() {

  type Internship = {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  stipend?: number | null;
  internship_type: string;
  apply_link?: string | null;
  posted_on: string; // ISO date string from backend
  status: "open" | "closed" | "archived";
  expiry_date?: string | null;
  recruiter: {
    id: number;
    username: string;
    // add other recruiter fields if needed
  };
};

const [internships, setInternships] = useState<Internship[]>([]);

  const { loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    internship_type: "",
    status: "",
  });
  const [sortByDate, setSortByDate] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/internships/?page=${page}`);
        setInternships(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load internships.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [page]);

  // Filter by model fields
  const filtered = internships.filter(i => {
    return (
      (!filters.location || i.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.internship_type || i.internship_type?.toLowerCase().includes(filters.internship_type.toLowerCase())) &&
      (!filters.status || i.status?.toLowerCase().includes(filters.status.toLowerCase()))
    );
  });

  // Sort by posted_on
  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.posted_on).getTime();
    const dateB = new Date(b.posted_on).getTime();
    return sortByDate === "newest" ? dateB - dateA : dateA - dateB;
  });

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
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Type (Full-time / Part-time)"
            value={filters.internship_type}
            onChange={e => setFilters({ ...filters, internship_type: e.target.value })}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Status (Open / Closed)"
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
        </div>

        {/* Sort */}
        <div className="mb-4 flex justify-end">
          <select
            value={sortByDate}
            onChange={e => setSortByDate(e.target.value as "newest" | "oldest")}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
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
