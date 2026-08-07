import { useReveal } from '../hooks/useReveal'

const values = [
  {
    title: 'Precision Protection',
    text: 'Sensor-driven cooling that responds to temperature, humidity, and ethylene in real time.',
  },
  {
    title: 'Digital Equity',
    text: 'Tools designed for rural farmers — off-grid, affordable, and built for community hubs.',
  },
  {
    title: 'Quality Preservation',
    text: 'Keeping produce market-ready from farm gate to buyer with verifiable storage logs.',
  },
]

export default function Mission() {
  const ref = useReveal()

  return (
    <section id="mission" className="relative overflow-hidden bg-mist py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-forest-100 blur-3xl" />
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-600">
              Identity
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl lg:text-5xl">
              Zero-waste supply chains, village by village
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:mt-6 sm:text-lg">
              Our mission is to pioneer affordable, IoT-enabled cooling for every
              community and every individual farmer — so Rwanda’s harvest is
              protected, not wasted.
            </p>
          </div>
          <div className="border-l-2 border-gold-500 pl-5 sm:pl-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
              Vision
            </p>
            <p className="mt-3 font-display text-xl leading-snug text-forest-800 sm:text-2xl">
              Lead Rwanda’s youth-driven AgTech revolution, ensuring 100% of the
              national harvest reaches the market in peak condition.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-forest-800/10 pt-10 sm:mt-16 sm:gap-10 sm:pt-12 md:grid-cols-3">
          {values.map((item, i) => (
            <div key={item.title} className={`reveal reveal-delay-${i + 1}`}>
              <h3 className="font-display text-lg font-semibold text-forest-900 sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
