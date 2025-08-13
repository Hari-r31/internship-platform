
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  BriefcaseIcon,
  ClipboardDocumentIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

const dashboardCards = [
  {
    label: "Post New Job",
    description: "Create and publish a new internship or job listing.",
    icon: <RocketLaunchIcon className="h-8 w-8 text-white" />,
    link: "/internships/new",
    gradient: "from-purple-600 to-indigo-600",
  },
  {
    label: "View My Jobs",
    description: "Manage your posted internships and view applicants.",
    icon: <BriefcaseIcon className="h-8 w-8 text-white" />,
    link: "/internships/mine",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    label: "Recent Activity",
    description: "Track your latest actions and job engagement.",
    icon: <ClipboardDocumentIcon className="h-8 w-8 text-white" />,
    link: "/activity_logs",
    gradient: "from-green-600 to-teal-600",
  },
];

const activityFeed = [
  {
    title: "Frontend Developer Internship",
    detail: "4 new applicants",
    icon: <BriefcaseIcon className="h-6 w-6 text-green-400" />,
  },
  {
    title: "Backend Role Updated",
    detail: "Job description changed",
    icon: <ClipboardDocumentIcon className="h-6 w-6 text-yellow-400" />,
  },
  {
    title: "Internship Deleted",
    detail: "Removed outdated listing",
    icon: <RocketLaunchIcon className="h-6 w-6 text-red-400" />,
  },
];

export default function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      {/* Header */}
      <header className="px-6 py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome, Recruiter 👋</h1>
        <p className="text-gray-400 text-lg">
          Manage your internships, track applicants, and stay productive.
        </p>
      </header>

      {/* Dashboard Cards */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-6 justify-center">
          {dashboardCards.map((card, i) => (
            <Link
              key={i}
              to={card.link}
              className={`w-full sm:w-[300px] bg-gradient-to-r ${card.gradient} rounded-xl shadow-lg p-6 transform transition hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white`}
            >
              <div className="flex items-center gap-4 mb-4">
                {card.icon}
                <h2 className="text-xl font-semibold text-white">{card.label}</h2>
              </div>
              <p className="text-sm text-white/80">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity Feed */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activityFeed.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-gray-800 rounded-lg p-4 shadow hover:shadow-xl transition"
            >
              {item.icon}
              <div>
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        <span className="text-blue-400 font-semibold">InternLink</span> © {new Date().getFullYear()}
      </footer>
    </div>
  );
}