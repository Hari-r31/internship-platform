
import { Link } from "react-router-dom";

type Props = {
  app: {
    internship: {
      id: number;
      title: string;
      location: string;
      company: string;
      type: string;
      duration: string;
      description: string;
    };
    status: "accepted" | "rejected" | "pending";
    updated_at: string;
  };
};

export default function ApplicationCard({ app }: Props) {
  const { internship, status, updated_at } = app;
  const statusColor =
    status === "accepted"
      ? "text-green-400"
      : status === "rejected"
      ? "text-red-400"
      : "text-yellow-400";

  const shortDesc =
    internship.description.length > 170
      ? internship.description.slice(0, 167) + "..."
      : internship.description;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white hover:scale-[1.02] transition transform">
      <h3 className="text-xl font-semibold mb-1">{internship.title}</h3>
      <p className="text-sm text-gray-300 mb-2">{internship.company} • {internship.location}</p>
      <p className="text-sm text-gray-400 mb-2">{internship.type} • {internship.duration}</p>
      <p className="text-sm text-gray-200 mb-4">{shortDesc}</p>
      <div className="flex justify-between items-center text-sm">
        <span className={statusColor}>Status: {status}</span>
        <span className="text-gray-400">
          Updated: {new Date(updated_at).toLocaleDateString()}
        </span>
      </div>
      <Link
        to={`/internships/${internship.id}/view/`}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        View Details
      </Link>
    </div>
  );
}