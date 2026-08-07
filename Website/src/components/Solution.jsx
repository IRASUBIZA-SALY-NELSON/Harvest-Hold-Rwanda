import { useReveal } from '../hooks/useReveal'

const highlights = [
  {
    label: 'Low cost',
    text: 'Locally sourced charcoal, wood, and solar components keep units affordable.',
  },
  {
    label: 'Eco-friendly',
    text: 'Zero chemical refrigerants — pure evaporative cooling physics.',
  },
  {
    label: 'IoT managed',
    text: 'Real-time temperature, humidity, and ethylene monitoring from the field.',
  },
  {
    label: 'Shelf life',
    text: 'Extends leafy greens and tomatoes from ~2 days to 14+ days.',
  },
]

export default function Solution() {
  const ref = useReveal()

  return (
    <section id="solution" className="bg-cloud py-16 sm:py-24 lg:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-600">
            Innovation
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl lg:text-5xl">
            Smart Hybrid Charcoal Cooling System
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
            Our student-engineered SHCCS unit uses evaporative cooling across wet
            charcoal panels to drop chamber temperatures by 8–15°C below ambient
            — preserving freshness without grid-powered refrigeration.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-sm sm:mt-12">
          <div className="media-scroll">
            <img
              src="/images/prototype.jpg"
              alt="Smart Hybrid Charcoal Cooler pitch prototype with IoT dashboard"
              className="h-auto w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-forest-800/10 pt-8 sm:mt-12 sm:grid-cols-2 sm:gap-8 sm:pt-10 lg:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
