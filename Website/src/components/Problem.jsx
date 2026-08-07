import { useReveal } from '../hooks/useReveal'

const gaps = [
  {
    title: 'Energy poverty',
    text: 'About 70% of farmers lack reliable grid access for conventional refrigeration.',
  },
  {
    title: 'Forced sales',
    text: 'Produce must be sold quickly at low prices to avoid rot — farmers lose market leverage.',
  },
  {
    title: 'Skills & market access',
    text: 'Limited post-harvest training and weak links to premium and export buyers.',
  },
  {
    title: 'Missing infrastructure',
    text: 'Decentralized, affordable cold-chain units simply do not exist at village scale.',
  },
]

export default function Problem() {
  const ref = useReveal()

  return (
    <section id="problem" className="relative bg-forest-950 py-16 text-white sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,122,77,0.35),transparent_40%)]" />
      <div ref={ref} className="reveal relative mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
              The post-harvest crisis
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              The invisible leakage
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              In Rwanda, 20% to 40% of horticultural produce rots before it
              reaches consumers. Nationally, up to 40% of food production is lost
              post-harvest — an economic blow that strips over{' '}
              <span className="text-gold-400">$140M+</span> annually from rural
              farming families.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-6">
              <div>
                <p className="font-display text-4xl font-semibold text-gold-400 sm:text-5xl">40%</p>
                <p className="mt-2 text-xs text-white/60 sm:text-sm">
                  Yield loss in horticulture
                </p>
              </div>
              <div>
                <p className="font-display text-4xl font-semibold text-gold-400 sm:text-5xl">70%</p>
                <p className="mt-2 text-xs text-white/60 sm:text-sm">
                  Farmers without grid power
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            {gaps.map((gap) => (
              <div
                key={gap.title}
                className="border-t border-white/15 pt-5"
              >
                <h3 className="font-display text-lg font-semibold text-white sm:text-xl">
                  {gap.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {gap.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
