// src/pages/Index.tsx

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";

const steps = [
  {
    number: "1",
    title: "Build a Projects",
    description:
      "Create and showcase real coding projects that demonstrate your skills.",
    color: "bg-blue-500",
  },
  {
    number: "2",
    title: "Be Discovered by Recruiters",
    description:
      "Let companies search, filter, and find you based on your work—not your grades.",
    color: "bg-green-500",
  },
  {
    number: "3",
    title: "Launch Your Career",
    description:
      "Secure internships for your proven abilities and join teams that value real-world talent.",
    color: "bg-purple-500",
  },
];

const features = [
  {
    icon: "📂",
    title: "Project-Centric",
    description: "Your code and projects speak louder than your transcript.",
  },
  {
    icon: "🔍",
    title: "Skill-Filtered Discovery",
    description:
      "Companies find you based solely on what you’ve built and your tech stack.",
  },
  {
    icon: "🕒",
    title: "Fast Placement",
    description:
      "Quickly connect with relevant opportunities—without endless resume sifting.",
  },
  {
    icon: "🔒",
    title: "Verified Quality",
    description:
      "Profiles are reviewed and endorsed to highlight real, trustworthy work.",
  },
];

const faqs = [
  {
    question: "Do I need a high GPA to get noticed?",
    answer:
      "Not at all! At InternLink, your coding projects and skills take center stage over academic scores.",
  },
  {
    question: "How do companies find me?",
    answer:
      "Recruiters search via filters like skills, tech stack, and project type—making discovery merit-based.",
  },
  {
    question: "Can companies trust the profiles?",
    answer:
      "Yes. Profiles are reviewed, and featured projects ensure credibility and quality.",
  },
  {
    question: "What types of internships are available?",
    answer:
      "Startups to enterprises use InternLink—anywhere that values hands-on skills over credentials.",
  },
];

export default function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Build Real Skills, <span className="text-blue-400">Stand Out</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-400">
          InternLink is where hands-on projects meet hiring opportunity. Showcase what you build—and find internships that recognize your real talent.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 text-lg font-medium shadow-md"
        >
          Get Started →
        </Link>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">How InternLink Works</h2>
          <p className="text-gray-400 mb-12">
            No grades. No resumes. Just your work in the spotlight. Here's the process:
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {steps.map((step) => (
              <div key={step.number} className="bg-slate-900 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                <div
                  className={`text-white ${step.color} rounded-full w-10 h-10 flex items-center justify-center mb-4`}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose InternLink */}
      <section className="py-16 bg-gray-950" id="why-choose">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Why Choose InternLink?</h2>
          <p className="text-gray-400 mb-12">Here’s how we redefine student hiring:</p>
          <div className="grid md:grid-cols-4 gap-8 text-left">
            {features.map((f) => (
              <div key={f.title} className="bg-slate-900 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="text-lg font-bold mb-1">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-800" id="faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 mb-8 text-center">
            Answers to common questions about project-based hiring and InternLink.
          </p>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-700 rounded-lg bg-slate-900 shadow">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full text-left px-4 py-3 font-medium hover:bg-slate-800 transition duration-200"
                >
                  {faq.question}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-sm text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 text-center text-sm py-6 mt-12 border-t border-gray-800">
        © {new Date().getFullYear()} InternLink. All rights reserved.
      </footer>
    </div>
  );
}