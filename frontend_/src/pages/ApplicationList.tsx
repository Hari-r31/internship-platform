import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import ApplicationCard from "../components/ApplicationCard";
import api from "../services/api";
import type { Application } from "../hooks/types"; // define type separately

export default function StudentApplications() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user?.profile?.role === "student") {
      const fetchApplications = async () => {
        try {
          const { data } = await api.get<{ results?: Application[] }>("/applications/mine/");
          console.log("Fetched applications:", data);

          if (data.results && Array.isArray(data.results)) {
            setApplications(data.results);
          } else if (Array.isArray(data)) {
            setApplications(data);
          } else {
            setApplications([]);
          }
        } catch (_) {
          setError("Unable to fetch applications.");
        } finally {
          setFetching(false);
        }
      };

      fetchApplications();
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading user info…
      </div>
    );
  }

  if (user?.profile?.role !== "student") {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Access restricted: Students only.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />
      <div className="px-4 py-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Internship Applications</h1>

        {fetching ? (
          <p className="text-gray-400">Loading applications…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-400">You have not applied to any internships yet.</p>
        ) : (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(345px, 1fr))" }}
          >
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
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
