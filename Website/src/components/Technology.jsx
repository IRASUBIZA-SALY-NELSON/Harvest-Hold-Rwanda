import { useReveal } from '../hooks/useReveal'

const suite = [
  {
    title: 'SHT3x monitoring',
    text: 'Precision temperature and humidity sensing, streamed to the cloud for continuous audits.',
  },
  {
    title: 'Ethylene sensing',
    text: 'Detects early C₂H₄ release so produce can be vented or dispatched before bulk spoilage.',
  },
  {
    title: 'ESP32 digital brain',
    text: 'DevKit V4 integrates sensors, relays, OLED UI, and automated fan/pump control.',
  },
  {
    title: 'LoRa / GSM sync',
    text: 'Remote transmission suited to Rwanda’s hills — real-time quality visibility off-grid.',
  },
]

const power = [
  '12V solar PV with LiPo battery backup',
  'Low water use: under 5L per day',
  'Gravity-fed drip to minimize pump energy',
  'Zero operating energy cost from the Rwandan sun',
]

export default function Technology() {
  const ref = useReveal()

  return (
    <section id="technology" className="bg-cloud py-16 sm:py-24 lg:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-600">
            Technology
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl lg:text-5xl">
            The sensor suite & off-grid brain
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
            Harvest Hold is more than a cooler — it is a connected quality node
            that protects produce and proves freshness for markets and exporters.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-sm border border-forest-800/10 bg-white">
            <img
              src="/images/iot-schematic.jpg"
              alt="IoT schematic for the Smart Hybrid Charcoal Cooler — ESP32, sensors, and power path"
              className="h-auto w-full object-contain object-center"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            {suite.map((item) => (
              <div key={item.title} className="border-t border-forest-800/15 pt-5">
                <h3 className="font-display text-lg font-semibold text-forest-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Photo-only image — avoids slide text overlapping HTML copy */}
        <div className="mt-12 grid overflow-hidden bg-forest-900 text-white lg:mt-16 lg:grid-cols-2">
          <div className="order-2 p-6 sm:p-8 lg:order-1 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
              Off-grid freedom
            </p>
            <h3 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
              Powered by the Rwandan sun
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              SHCCS units run on solar with battery backup — designed for remote
              villages where conventional cold rooms cannot reach.
            </p>
            <ul className="mt-6 space-y-3 sm:mt-8">
              {power.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 min-h-48 lg:order-2 lg:min-h-0">
            <img
              src="/images/solar-farm.jpg"
              alt="Solar array powering rural cold-chain infrastructure"
              className="h-48 w-full object-cover sm:h-64 lg:h-full lg:min-h-80"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
