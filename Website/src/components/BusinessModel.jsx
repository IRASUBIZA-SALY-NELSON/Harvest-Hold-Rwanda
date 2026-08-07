import { useReveal } from '../hooks/useReveal'

export default function BusinessModel() {
  const ref = useReveal()

  return (
    <section id="model" className="bg-forest-950 py-16 text-white sm:py-24 lg:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
              Business model
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Hardware-as-a-Service for lasting impact
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/70 sm:text-base">
            We operate as a social enterprise. Farmers pay a small cooling fee
            per crate or per day — covering maintenance, IoT data, and local
            operators — so the network outlives grant cycles and becomes a
            permanent fixture in Rwanda’s agricultural landscape.
          </p>
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 sm:mt-14 sm:pt-10 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl font-semibold text-gold-400 sm:text-4xl">~100</p>
            <p className="mt-2 text-sm text-white/60">
              FRW per crate cooling fee concept — accessible, scalable hubs at markets
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-gold-400 sm:text-4xl">HaaS</p>
            <p className="mt-2 text-sm text-white/60">
              Shared cooling infrastructure instead of unaffordable private cold rooms
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-gold-400 sm:text-4xl">Impact</p>
            <p className="mt-2 text-sm text-white/60">
              Food security, farmer income, and modernized post-harvest systems nationwide
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
