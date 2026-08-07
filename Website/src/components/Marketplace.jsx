import { useReveal } from '../hooks/useReveal'

const pillars = [
  {
    title: 'Ethylene monitoring',
    text: 'Early ripening signals trigger dispatch windows — sell at peak, not after spoilage.',
  },
  {
    title: 'Data immutability',
    text: 'Historical storage logs give buyers proof of quality and shelf-life confidence.',
  },
  {
    title: 'RSB alignment',
    text: 'Working toward Rwanda Standards Board certification for IoT-stored produce.',
  },
]

export default function Marketplace() {
  const ref = useReveal()

  return (
    <section id="marketplace" className="bg-mist py-16 sm:py-24 lg:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-600">
              Digital marketplace
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl lg:text-5xl">
              Certified Fresh, connected to buyers
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink/70 sm:text-base">
              Harvest Hold silos act as nodes in a network. When produce approaches
              peak ripeness, inventory can list on our marketplace — exporters,
              hotels, and wholesalers bid while goods remain cooled, enabling a
              near zero-day transit window once removed.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/70 sm:text-base">
              Virtual quality certificates — developed in collaboration paths with
              RSB and NAEB — help smallholders access export and premium local
              markets with documented storage conditions.
            </p>

            <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
              {pillars.map((p) => (
                <div key={p.title} className="border-l-2 border-gold-500 pl-4 sm:pl-5">
                  <h3 className="font-display text-lg font-semibold text-forest-900 sm:text-xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <img
              src="/images/produce.jpg"
              alt="Fresh vegetables ready for market"
              className="w-full rounded-sm object-cover"
            />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:gap-3">
              {[
                ['Live T/H', 'Dashboard'],
                ['Alerts', 'SMS / app'],
                ['Reports', 'Quality certs'],
              ].map(([a, b]) => (
                <div key={a} className="border-t border-forest-800/15 pt-3">
                  <p className="text-xs font-semibold text-forest-800 sm:text-sm">{a}</p>
                  <p className="text-[10px] text-ink/50 sm:text-xs">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
