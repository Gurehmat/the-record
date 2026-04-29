const checks = [
  'TAILWIND ACTIVE',
  'DESIGN TOKENS LOADED',
  'TYPOGRAPHY WIRED',
  'READY FOR PROCEEDINGS',
]

function App() {
  return (
    <main className="min-h-screen bg-parchment text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 px-6 py-10">
        <header className="text-center">
          <h1 className="font-display text-6xl font-bold uppercase tracking-[0.2em] sm:text-7xl md:text-8xl">
            THE RECORD
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-[0.15em] sm:text-base">
            SYSTEM CHECK // ALL SYSTEMS NOMINAL
          </p>
        </header>

        <section className="w-full max-w-2xl rounded-sm border-[3px] border-ink bg-parchment p-6 shadow-brutal">
          <ul className="space-y-3 font-mono text-sm uppercase tracking-[0.08em] sm:text-base">
            {checks.map((item) => (
              <li key={item} className="text-verified">
                {'\u2713'} {item}
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          className="rounded-sm border-[3px] border-ink bg-ink px-8 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-parchment shadow-brutal-red transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          BEGIN BUILD {'\u2192'}
        </button>
      </div>
    </main>
  )
}

export default App
