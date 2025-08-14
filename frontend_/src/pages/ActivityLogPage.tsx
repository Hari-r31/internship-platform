import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import ActivityLogCard from "../components/ActivityLogCard";
import api from "../services/api";
import type { ActivityLog } from "../hooks/types"; // typed import

export default function ActivityLogPage() {
  const { user, loading: authLoading } = useAuth();

  const [logs, setLogs] = useState<ActivityLog[]>([]); // typed state
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      const fetchLogs = async () => {
        try {
          const { data } = await api.get<{ results?: ActivityLog[] }>("/activity_logs/");
          console.log("Fetched activity_logs:", data);

          if (data.results && Array.isArray(data.results)) {
            setLogs(data.results);
          } else if (Array.isArray(data)) {
            setLogs(data);
          } else {
            setLogs([]);
          }
        } catch {
          setError("Unable to fetch activity logs.");
        } finally {
          setFetching(false);
        }
      };

      fetchLogs();
    }
  }, [authLoading, user]);

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
        <h1 className="text-3xl font-bold mb-6">My Activity Logs</h1>

        {fetching ? (
          <p className="text-gray-400">Loading activity logs…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-400">No activity logs found.</p>
        ) : (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(345px, 1fr))" }}
          >
            {logs.map((log) => (
              <ActivityLogCard key={log.id} log={log} />
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
