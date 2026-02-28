export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-zinc-400">
            Wellness-Centered Decision Support
          </p>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            <span className="neon-accent">MindMap</span>
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-zinc-300">
            A structured decision-support platform for college students and early-career usersnavigating
            difficult academic, personal, and career choices.
          </p>
        </header>

        <section className="neon-card p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Start with your dilemma</h2>

          <p className="mt-2 text-zinc-400">
            Describe a tough decision, and MindMap will help break it down through
            emotional, ethical, social, and practical lenses.
          </p>

          <div className="mt-6">
            <textarea
              className="min-h-[180px] w-full rounded-2xl border border-zinc-700 bg-black/40 p-4 text-white outline-none focus:border-blue-400"
              placeholder="Example: I have an internship offer, but taking it may hurt my grades and increase my stress..."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-2xl border border-blue-400/40 bg-blue-500/10 px-5 py-3 font-medium text-white transition hover:bg-blue-500/20">
              Begin Decision Map
            </button>

            <button className="rounded-2xl border border-lime-400/30 bg-lime-300/5 px-5 py-3 font-medium text-lime-300 transition hover:bg-lime-300/10">
              View Example
            </button>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            MindMap offers guidance and perspective only. It does not make decisions
            for you and is not responsible for actions taken based on its suggestions.
          </p>
        </section>
      </div>
    </main>
  );
}