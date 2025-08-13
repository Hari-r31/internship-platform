import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function ApplicantsListPage() {
  const { internship_id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data } = await api.get(`/internships/${internship_id}/applicants/`);
        console.log("Applicants API response:", data);
        setApplicants(data.results || []); // only store results array
      } catch (err) {
        setError("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [internship_id]);

  const updateStatus = async (applicationId: number, status: string) => {
    try {
      await api.patch(`/applications/${applicationId}/status/`, { status });
      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );
      alert(`Application ${status}`);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Navbar />
        <div className="p-6">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-300 hover:underline"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-4">Applicants</h1>

        {applicants.length === 0 ? (
          <p className="text-gray-400">No applicants have applied yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Resume</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Applied On</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app: any) => (
                  <tr key={app.id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{app.user.username}</td>
                    <td className="px-4 py-2">
                      {app.user.profile.first_name} {app.user.profile.last_name}
                    </td>
                    <td className="px-4 py-2">
                      {app.resume ? (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        "No resume"
                      )}
                    </td>
                    <td className="px-4 py-2">{app.status}</td>
                    <td className="px-4 py-2">
                      {new Date(app.applied_on).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
  {app.status === "pending" ? (
    <>
      <button
        onClick={() => updateStatus(app.id, "accepted")}
        className="bg-green-600 px-2 py-1 rounded hover:bg-green-700 text-white"
      >
        Accept
      </button>
      <button
        onClick={() => updateStatus(app.id, "rejected")}
        className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 text-white"
      >
        Reject
      </button>
    </>
  ) : (
    <span
      className={`px-2 py-1 rounded text-white ${
        app.status === "accepted" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
    </span>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
