import { useNavigate } from "react-router-dom";
import type { Internship } from "../hooks/types";

type Props = {
  internship: Internship;
};

export default function RecruiterPostedListCard({ internship }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/internships/${internship.id}/view`)}
      className="cursor-pointer bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
    >
      <h2 className="text-xl font-semibold mb-1">{internship.title ?? "Untitled"}</h2>
      <p className="text-sm text-gray-300 mb-1">
        {internship.company ?? "Unknown Company"} • {internship.location ?? "Unknown Location"}
      </p>
      <p className="text-sm text-gray-400 mb-2">
        {internship.internship_type ?? "—"} • {internship.stipend ? `₹${internship.stipend}` : "—"}
      </p>
      <p className="text-sm text-gray-500">Status: {internship.status ?? "—"}</p>
    </div>
  );
}
