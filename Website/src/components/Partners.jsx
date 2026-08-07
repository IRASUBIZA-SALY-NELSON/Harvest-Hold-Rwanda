import { useReveal } from '../hooks/useReveal'

const partners = [
  {
    name: 'MINAGRI',
    fullName: 'Ministry of Agriculture & Animal Resources',
    role: 'Policy alignment and rural site access for national deployment.',
    logo: '/partners/minagri.jpeg',
  },
  {
    name: 'UR-CAVM',
    fullName: 'University of Rwanda — CAVM',
    role: 'Technical R&D, student talent, and laboratory sensor testing.',
    logo: '/partners/ur-cavm.png',
  },
  {
    name: 'RSSB',
    fullName: 'Rwanda Social Security Board',
    role: 'Institutional partnership supporting sustainable rural livelihoods and social protection.',
    logo: '/partners/rssb.png',
  },
  {
    name: 'NAEB',
    fullName: 'National Agricultural Export Development Board',
    role: 'Export pathways and market linkages for quality-certified produce.',
    logo: '/partners/naeb.png',
  },
]

function PartnerCard({ partner, index }) {
  const ref = useReveal()
  const delay =
    index === 1 ? 'reveal-delay-1' : index === 2 ? 'reveal-delay-2' : index === 3 ? 'reveal-delay-3' : ''

  return (
    <article
      ref={ref}
      className={`reveal group relative overflow-hidden border border-forest-800/10 bg-white p-6 transition duration-500 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-[0_24px_60px_rgba(12,31,24,0.12)] ${delay}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-forest-600 to-gold-500 transition duration-500 group-hover:scale-x-100" />

      <div className="flex h-28 items-center justify-center rounded-sm bg-cloud/80 px-4 transition duration-500 group-hover:bg-forest-50">
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
          className="max-h-20 w-auto max-w-full object-contain transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-5 border-t border-forest-800/10 pt-5">
        <h3 className="font-display text-2xl font-semibold text-forest-900 transition group-hover:text-forest-700">
          {partner.name}
        </h3>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gold-600">
          {partner.fullName}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">{partner.role}</p>
      </div>
    </article>
  )
}

export default function Partners() {
  const ref = useReveal()

  return (
    <section id="partners" className="relative overflow-hidden bg-mist py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-forest-100/80 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />

      <div ref={ref} className="reveal relative mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-600">
            Collaboration
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest-900 sm:text-4xl lg:text-5xl">
            Built with Rwanda’s institutions
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
            Strategic collaboration keeps Harvest Hold aligned with national
            agriculture policy, standards, research, and export systems.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {partners.map((partner, index) => (
            <PartnerCard key={partner.name} partner={partner} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
