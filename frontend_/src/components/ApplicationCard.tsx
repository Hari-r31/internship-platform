import { Link } from "react-router-dom";
import type { Application } from "../hooks/types";

type Props = {
  application: Application;
};

export default function ApplicationCard({ application }: Props) {
  const { internship, status } = application;

  const statusColor =
    status === "accepted"
      ? "text-green-400"
      : status === "rejected"
      ? "text-red-400"
      : "text-yellow-400";

  const shortDesc = internship?.description
    ? internship.description.length > 170
      ? internship.description.slice(0, 167) + "..."
      : internship.description
    : "No description available";

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white hover:scale-[1.02] transition transform">
      <h3 className="text-xl font-semibold mb-1">{internship?.title ?? "Untitled Internship"}</h3>
      <p className="text-sm text-gray-300 mb-2">
        {internship?.company ?? "Unknown Company"} • {internship?.location ?? "Unknown Location"}
      </p>
      <p className="text-sm text-gray-200 mb-4">{shortDesc}</p>
      <div className="flex justify-between items-center text-sm">
        <span className={statusColor}>Status: {status ?? "—"}</span>
      </div>
      <Link
        to={`/internships/${internship?.id}/view/`}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        View Details
      </Link>
    </div>
  );
}
