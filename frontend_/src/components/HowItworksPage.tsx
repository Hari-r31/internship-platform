import Navbar from "./Navbar";

const studentSteps = [
  {
    number: "1",
    title: "Build Your Digital Portfolio",
    bullets: [
      "Add your best coding projects",
      "List core programming skills",
      "Write clear project descriptions",
      "Link GitHub, portfolio, and demos",
    ],
    color: "bg-blue-500",
  },
  {
    number: "2",
    title: "Show Your Skills in Action",
    bullets: [
      "Present real-world project outcomes",
      "Highlight challenges solved",
      "Demonstrate teamwork & creativity",
      "Display proficiency in tools & tech",
    ],
    color: "bg-teal-500",
  },
  {
    number: "3",
    title: "Connect With Opportunities",
    bullets: [
      "Get found by companies searching your skills",
      "Match with relevant internships & jobs",
      "Receive interview invites directly",
      "Kickstart your career journey",
    ],
    color: "bg-purple-500",
  },
];

const companySteps = [
  {
    number: "1",
    title: "Find Talent Faster",
    bullets: [
      "Filter by specific tech stacks",
      "Search by project type & complexity",
      "Narrow results by availability & location",
    ],
    color: "bg-blue-500",
  },
  {
    number: "2",
    title: "Assess Real Work Samples",
    bullets: [
      "View code repositories & live demos",
      "Understand problem-solving processes",
      "Gauge technical expertise quickly",
      "Identify innovative thinking",
    ],
    color: "bg-teal-500",
  },
  {
    number: "3",
    title: "Hire With Confidence",
    bullets: [
      "Contact candidates directly",
      "Skip unnecessary screening rounds",
      "Focus on skill and project outcomes",
      "Build high-performing teams",
    ],
    color: "bg-purple-500",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white font-sans">
      <Navbar />
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">How InternLink Works</h1>
          <p className="text-gray-400 mb-12">
            A streamlined process that connects skilled students with companies through portfolios and project-based evaluations.
          </p>

          {/* For Students */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              👨‍🎓 For Students
            </h2>
            <p className="text-gray-400 mb-8">
              Turn your work into your strongest career asset.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {studentSteps.map((step) => (
                <div key={step.number} className="bg-slate-900 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                  <div
                    className={`text-white ${step.color} rounded-full w-10 h-10 flex items-center justify-center mb-4`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {step.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* For Companies */}
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              🏢 For Companies
            </h2>
            <p className="text-gray-400 mb-8">
              Discover talent that’s ready to deliver from day one.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {companySteps.map((step) => (
                <div key={step.number} className="bg-slate-900 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                  <div
                    className={`text-white ${step.color} rounded-full w-10 h-10 flex items-center justify-center mb-4`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {step.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-black text-gray-500 text-center text-sm py-6 mt-12 border-t border-gray-800">
        © {new Date().getFullYear()} InternLink. All rights reserved.
      </footer>
    </div>
  );
}