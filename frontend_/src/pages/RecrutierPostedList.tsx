import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import InternshipCard from "../components/RecrutierPostedListcard";
import api from "../services/api";
import type { Internship } from "../hooks/types";

export default function RecruiterPostedList() {
  const { user, loading: authLoading } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const { data } = await api.get<{ results?: Internship[] }>("/internships/mine/");
        console.log("Fetched posted jobs:", data);

        if (data.results && Array.isArray(data.results)) {
          setInternships(data.results);
        } else if (Array.isArray(data)) {
          setInternships(data);
        } else {
          setInternships([]);
        }
      } catch (_) {
        setError("Unable to fetch internships.");
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
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(345px, 1fr))" }}
          >
            {internships.map((job) => (
              <InternshipCard key={job.id} internship={job} />
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
