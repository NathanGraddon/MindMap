import Link from "next/link";
export default function AboutPage() {
    return (
      <div className="min-h-screen bg-black text-white px-8 py-20">
        {/* Hero */}
        <section className="max-w-5xl mx-auto text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            About MindMap
          </h1>
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
            MindMap is a wellness-centered decision-support platform built to help
            anyone navigate complex academic, personal, and career
            decisions with clarity and balance.
          </p>
        </section>
  
        {/* Why Section */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold mb-6">Why We Built It</h2>
          <p className="text-neutral-400 leading-relaxed">
            Students face difficult choices every day — internships, course loads,
            financial tradeoffs, relationship conflicts, and long-term career
            decisions. Most tools offer either productivity or advice. MindMap
            focuses on perspective.
          </p>
          <p className="text-neutral-400 leading-relaxed mt-4">
            Instead of telling you what to do, MindMap breaks decisions down across
            emotional well-being, ethical responsibility, social impact, practicality,
            and long-term growth.
          </p>
        </section>
  
        {/* Core Values */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Our Core Principles
          </h2>
  
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Well-being First",
                desc: "Decisions should support mental clarity and reduce burnout, not amplify stress.",
              },
              {
                title: "Ethical Awareness",
                desc: "Choices ripple outward. We help users consider fairness and impact.",
              },
              {
                title: "Long-Term Growth",
                desc: "Short-term wins should not sabotage long-term direction.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0b1020] border border-white/5 rounded-2xl p-6 hover:border-purple-500/40 transition"
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
  
        {/* How It Works */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
          <ul className="space-y-4 text-neutral-400">
            <li>• You describe your dilemma.</li>
            <li>• MindMap generates realistic options.</li>
            <li>• Each option is evaluated through multiple lenses.</li>
            <li>• You receive a balanced recommendation and next step.</li>
          </ul>
        </section>
  
        {/* CTA */}
        <section className="text-center">
          <p className="text-neutral-500 mb-6">
            MindMap does not replace human judgment — it strengthens it.
          </p>
        <Link
          href="/"
           className="inline-block px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
        >
          Try MindMap
        </Link>
        </section>
      </div>
    );
  }