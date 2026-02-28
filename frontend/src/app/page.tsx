'use client'

import { useMemo, useState } from 'react'

type FormState = {
  dilemma: string
  category: string
  urgency: number
  emotion: string
  stakeholders: string
  goal: string
}

const initialState: FormState = {
  dilemma: '',
  category: 'academic',
  urgency: 5,
  emotion: '',
  stakeholders: '',
  goal: '',
}

export default function Home() {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(initialState)

  const canContinueStep1 = form.dilemma.trim().length > 10
  const canContinueStep2 =
    form.emotion.trim().length > 0 && form.stakeholders.trim().length > 0
  const canContinueStep3 = form.goal.trim().length > 0

  const summary = useMemo(() => {
    return {
      urgencyLabel:
        form.urgency <= 3
          ? 'Low'
          : form.urgency <= 7
            ? 'Moderate'
            : 'High',
    }
  }, [form.urgency])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetFlow() {
    setStarted(false)
    setStep(1)
    setForm(initialState)
  }

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
            A structured decision-support platform for college students navigating
            difficult academic, personal, and career choices.
          </p>
        </header>

        {!started ? (
          <section className="neon-card p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Start with your dilemma</h2>

            <p className="mt-2 text-zinc-400">
              Describe a tough decision, and MindMap will help break it down through
              emotional, ethical, social, and practical lenses.
            </p>

            <div className="mt-6">
              <textarea
                value={form.dilemma}
                onChange={(e) => updateField('dilemma', e.target.value)}
                className="min-h-[180px] w-full rounded-2xl border border-zinc-700 bg-black/40 p-4 text-white outline-none focus:border-blue-400"
                placeholder="Example: I have an internship offer, but taking it may hurt my grades and increase my stress..."
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setStarted(true)}
                disabled={!canContinueStep1}
                className="rounded-2xl border border-blue-400/40 bg-blue-500/10 px-5 py-3 font-medium text-white transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Begin Decision Map
              </button>

              <button
                onClick={() =>
                  setForm({
                    dilemma:
                      'I have an internship offer, but accepting it may raise my stress, reduce study time, and affect my grades.',
                    category: 'career',
                    urgency: 7,
                    emotion: '',
                    stakeholders: '',
                    goal: '',
                  })
                }
                className="rounded-2xl border border-lime-400/30 bg-lime-300/5 px-5 py-3 font-medium text-lime-300 transition hover:bg-lime-300/10"
              >
                View Example
              </button>
            </div>

            <p className="mt-6 text-sm text-zinc-500">
              MindMap offers guidance and perspective only. It does not make decisions
              for you and is not responsible for actions taken based on its suggestions.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="neon-card p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                    Intake Flow
                  </p>
                  <h2 className="text-2xl font-semibold">Build your decision map</h2>
                </div>
                <div className="text-sm text-zinc-400">Step {step} of 3</div>
              </div>

              <div className="mb-8 h-2 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      What decision are you facing?
                    </label>
                    <textarea
                      value={form.dilemma}
                      onChange={(e) => updateField('dilemma', e.target.value)}
                      className="min-h-[160px] w-full rounded-2xl border border-zinc-700 bg-black/40 p-4 text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Which area fits best?
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full rounded-2xl border border-zinc-700 bg-black/40 p-4 text-white outline-none focus:border-blue-400"
                    >
                      <option value="academic">Academic</option>
                      <option value="career">Career</option>
                      <option value="personal">Personal</option>
                      <option value="social">Social</option>
                      <option value="ethical">Ethical</option>
                      <option value="wellness">Wellness</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      How urgent does this feel? ({form.urgency}/10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={form.urgency}
                      onChange={(e) => updateField('urgency', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      What are you feeling right now?
                    </label>
                    <input
                      value={form.emotion}
                      onChange={(e) => updateField('emotion', e.target.value)}
                      className="w-full rounded-2xl border border-zinc-700 bg-black/40 p-4 text-white outline-none focus:border-blue-400"
                      placeholder="Anxious, overwhelmed, pressured, hopeful..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Who could be affected?
                    </label>
                    <textarea
                      value={form.stakeholders}
                      onChange={(e) => updateField('stakeholders', e.target.value)}
                      className="min-h-[140px] w-full rounded-2xl border border-zinc-700 bg-black/40 p-4 text-white outline-none focus:border-blue-400"
                      placeholder="Me, my advisor, my team, my family, my roommate..."
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      What outcome do you want most?
                    </label>
                    <textarea
                      value={form.goal}
                      onChange={(e) => updateField('goal', e.target.value)}
                      className="min-h-[160px] w-full rounded-2xl border border-zinc-700 bg-black/40 p-4 text-white outline-none focus:border-blue-400"
                      placeholder="I want the most responsible choice that protects my mental health and keeps me on track long-term."
                    />
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                    <p className="text-sm text-zinc-400">
                      Next, we’ll send this to the backend and generate:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                      <li>• 3 realistic options</li>
                      <li>• multi-lens scoring</li>
                      <li>• tradeoff analysis</li>
                      <li>• a best-balanced recommendation</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-800"
                  >
                    Back
                  </button>
                )}

                {step < 3 && (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={
                      (step === 1 && !canContinueStep1) ||
                      (step === 2 && !canContinueStep2)
                    }
                    className="rounded-2xl border border-blue-400/40 bg-blue-500/10 px-5 py-3 font-medium text-white transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                  </button>
                )}

                {step === 3 && (
                  <button
                    disabled={!canContinueStep3}
                    className="rounded-2xl border border-lime-400/30 bg-lime-300/5 px-5 py-3 font-medium text-lime-300 transition hover:bg-lime-300/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Generate Decision Map
                  </button>
                )}

                <button
                  onClick={resetFlow}
                  className="rounded-2xl border border-pink-400/30 bg-pink-400/5 px-5 py-3 font-medium text-pink-300 transition hover:bg-pink-400/10"
                >
                  Reset
                </button>
              </div>
            </div>

            <aside className="neon-card p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Live Snapshot
              </p>
              <h3 className="mt-2 text-xl font-semibold">Current context</h3>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-zinc-500">Category</p>
                  <p className="text-zinc-200">{form.category || '—'}</p>
                </div>

                <div>
                  <p className="text-zinc-500">Urgency</p>
                  <p className="text-zinc-200">
                    {form.urgency}/10 ({summary.urgencyLabel})
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">Emotion</p>
                  <p className="text-zinc-200">{form.emotion || '—'}</p>
                </div>

                <div>
                  <p className="text-zinc-500">Stakeholders</p>
                  <p className="text-zinc-200 whitespace-pre-wrap">
                    {form.stakeholders || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">Desired outcome</p>
                  <p className="text-zinc-200 whitespace-pre-wrap">
                    {form.goal || '—'}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <p className="text-xs leading-6 text-zinc-500">
                  MindMap provides structured guidance, not legal, medical, or crisis
                  intervention advice.
                </p>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  )
}