import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Kickstart Your Career with{" "}
          <span className="text-blue-400">Your Skills & Projects</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Forget competing on grades alone—showcase what you’ve built and get
          hired for your abilities, creativity, and problem-solving skills.
        </p>
        <Link
          to="/internships/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 text-lg font-medium shadow"
        >
          Explore Internships →
        </Link>
      </section>

      {/* Why Students Choose */}
      <section className="bg-slate-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Why Students Prefer InternLink
          </h2>
          <p className="text-gray-400 mb-12">
            Opportunities based on talent, not titles.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {[
              "Skills Come First",
              "Direct Connection to Recruiters",
              "Match by Portfolio",
              "No Institutional Bias",
            ].map((title, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <p className="text-gray-400 text-sm">
                  {title === "Skills Come First"
                    ? "Showcase your real capabilities through completed work."
                    : title === "Direct Connection to Recruiters"
                    ? "Engage with decision-makers who value hands-on experience."
                    : title === "Match by Portfolio"
                    ? "Get suggested for roles that align with your showcased projects."
                    : "Your achievements matter more than your college name."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes a Great Profile */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Elements of a Strong Student Profile
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
            {[
              {
                title: "Project Portfolio",
                bullets: [
                  "Web apps & platforms",
                  "Data science & AI models",
                  "Mobile applications",
                  "Game development projects",
                ],
              },
              {
                title: "Technical Expertise",
                bullets: [
                  "Languages: JavaScript, Python, SQL",
                  "Frameworks: React, Node.js, Django",
                  "Version Control: Git & GitHub",
                  "Tools: Bash, Figma, AWS",
                ],
              },
              {
                title: "Professional Presence",
                bullets: [
                  "GitHub repositories",
                  "LinkedIn profile",
                  "Personal website or portfolio",
                  "Prior internships or freelance work",
                ],
              },
            ].map((section, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {section.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Project-Based Hiring Works */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-slate-900 p-6 rounded-lg shadow hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-bold mb-2">Proof Over Claims</h3>
            <p className="text-gray-400 text-sm">
              Let your portfolio speak louder than grades. Employers want to see
              how you solve problems and turn ideas into reality.
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg shadow hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-bold mb-2">Equal Opportunities</h3>
            <p className="text-gray-400 text-sm">
              Level the playing field by highlighting your actual skills and
              results—no matter your background or institution.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Put Your Work in the Spotlight?
        </h2>
        <p className="mb-6 text-lg text-gray-300">
          Join students who are landing internships through project-driven
          hiring.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 text-lg font-medium shadow"
        >
          Create Your Profile Now →
        </Link>
      </section>

      <footer className="bg-gray-950 text-gray-500 text-center text-sm py-6 mt-12 border-t border-gray-800">
        © {new Date().getFullYear()} InternLink. All rights reserved.
      </footer>
    </div>
  );
}