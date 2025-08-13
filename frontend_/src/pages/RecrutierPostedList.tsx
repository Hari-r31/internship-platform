import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function RecruiterPostedList() {
  const { user, loading: authLoading } = useAuth();
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
          const { data } = await api.get("/internships/mine/");
          console.log("Fetched posted jobs:", data);
          if (data && Array.isArray(data.results)) {
            setInternships(data.results);
          } else if (Array.isArray(data)) {
            setInternships(data);
          } else {
            setInternships([]);
          }
        } catch (_) {
          setError("Unable to fetch applications.");
        } finally {
          setError(false);
        }
    };

    if (!authLoading && user?.profile?.role === "recruiter") {
      fetchInternships();
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading user info…
      </div>
    );
  }

  if (user?.profile?.role !== "recruiter") {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Access denied.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />

      <div className="px-4 py-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Posted Internships</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {internships.length === 0 ? (
          <p className="text-gray-400">You haven’t posted any internships yet.</p>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(345px, 1fr))",
            }}
          >
            {internships.map((job: any) => (
              <div
                key={job.id}
                onClick={() => navigate(`/internships/${job.id}/view`)}
                className="cursor-pointer bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
                <p className="text-sm text-gray-300 mb-1">
                  {job.company} • {job.location}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  {job.internship_type} • ₹{job.stipend}
                </p>
                <p className="text-sm text-gray-500">Status: {job.status}</p>
              </div>
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
