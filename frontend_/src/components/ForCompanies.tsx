import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function ForCompaniesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Connect with Engineers Who Deliver{" "}
          <span className="text-blue-400">Real Results</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Skip the resume pile. Evaluate real-world projects and hire candidates who can contribute from day one.
        </p>
        <Link
          to="/register/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 text-lg font-medium shadow"
        >
          Explore Engineering Talent →
        </Link>
      </section>

      {/* Problems vs Solutions */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-blue-400 mb-4">Hiring Challenges</h2>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
              <li>Generic resumes with no proof of skills</li>
              <li>Strong academics but no practical exposure</li>
              <li>Lengthy and costly screening stages</li>
              <li>Overlooking talent from non-traditional backgrounds</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-400 mb-4">Our Approach</h2>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
              <li>Assess real projects before interviews</li>
              <li>Find candidates with proven technical expertise</li>
              <li>Reduce hiring time with skill-based matching</li>
              <li>Tap into talent from every corner</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hiring Features */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Why Hire With Us</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
            {[
              {
                title: "Skill-Based Search",
                bullets: [
                  "Filter by exact technical competencies",
                  "Choose based on project complexity",
                  "Match location and availability",
                  "Target the right engineering fields",
                ],
              },
              {
                title: "Portfolio Insights",
                bullets: [
                  "Browse live project examples",
                  "See measurable outcomes",
                  "Understand their problem-solving process",
                  "Evaluate real-world technical quality",
                ],
              },
              {
                title: "Direct Engagement",
                bullets: [
                  "Connect instantly with candidates",
                  "Avoid unnecessary interview rounds",
                  "Speed up hiring decisions",
                  "Foster direct relationships with top talent",
                ],
              },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {feature.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Highlights */}
          <div className="grid md:grid-cols-4 gap-6 mt-12 text-left">
            {[
              "Faster Hiring",
              "Verified Talent",
              "Expanding Network",
              "Better Matches",
            ].map((title, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-4 shadow hover:shadow-md transition duration-200">
                <h4 className="text-sm font-semibold mb-1">{title}</h4>
                <p className="text-gray-400 text-sm">
                  {title === "Faster Hiring"
                    ? "Reduce hiring cycles with pre-verified candidates"
                    : title === "Verified Talent"
                    ? "Engineers with demonstrated real-world skills"
                    : title === "Expanding Network"
                    ? "More companies finding their perfect match"
                    : "Matching based on skills and project fit"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Types */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ideal for Every Organization</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
            {[
              {
                title: "Startups",
                description:
                  "Hire adaptable engineers who can handle diverse tasks and innovate quickly.",
              },
              {
                title: "Growing Companies",
                description:
                  "Build teams with engineers who can contribute to scaling products and services.",
              },
              {
                title: "Large Enterprises",
                description:
                  "Find specialists with deep expertise in modern technologies and workflows.",
              },
            ].map((company, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                <h3 className="text-lg font-semibold mb-2">{company.title}</h3>
                <p className="text-gray-400 text-sm">{company.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-Darkblue-600 text-white text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-4">Hire for Skills, Not Just Resumes</h2>
        <p className="mb-6 text-lg">
          Be part of the new wave of companies hiring based on proven ability and hands-on performance.
        </p>
        <Link
          to="/register/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 text-lg font-medium shadow"
        >
          Get Started →
        </Link>
      </section>

      <footer className="bg-gray-950 text-gray-500 text-center text-sm py-6 mt-12 border-t border-gray-800">
        © {new Date().getFullYear()} InternLink. All rights reserved.
      </footer>
    </div>
  );
}