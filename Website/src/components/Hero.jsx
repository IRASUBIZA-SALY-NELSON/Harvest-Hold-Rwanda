export default function Hero() {
  return (
    <section id="top" className="relative min-h-svh overflow-hidden">
      <img
        src="/images/hero.jpg"
        alt="Fresh harvest ready for market"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/92 via-forest-900/78 to-forest-800/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.18),transparent_45%)]" />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-4 pb-14 pt-24 sm:px-5 sm:pb-16 sm:pt-28 lg:justify-center lg:px-8 lg:pb-24 lg:pt-24">
        <div className="max-w-2xl animate-[fadeUp_1s_ease-out_forwards]">
          <p className="mb-4 font-display text-3xl font-semibold tracking-tight text-white sm:mb-5 sm:text-5xl lg:text-6xl">
            Harvest Hold
            <span className="mt-1 block text-xl font-medium tracking-[0.18em] text-gold-400 sm:text-3xl">
              RWANDA
            </span>
          </p>
          <h1 className="max-w-xl font-sans text-lg font-medium leading-snug text-white/90 sm:text-2xl">
            Eliminating post-harvest loss through IoT and AI
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
            Affordable, solar-powered cooling and market intelligence so every
            smallholder harvest reaches buyers in peak condition.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#solution"
              className="rounded-sm bg-gold-500 px-6 py-3.5 text-center text-sm font-semibold text-forest-950 transition hover:bg-gold-400 sm:py-3"
            >
              Explore the solution
            </a>
            <a
              href="#contact"
              className="rounded-sm border border-white/35 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:border-gold-400 hover:text-gold-400 sm:py-3"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
