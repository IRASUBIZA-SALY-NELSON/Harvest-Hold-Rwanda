import { Link } from 'react-router-dom'
import { teamMembers } from '../data/team'
import { useReveal } from '../hooks/useReveal'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3h3l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L21 14v3a2 2 0 0 1-2.2 2A16 16 0 0 1 5 6.2 2 2 0 0 1 7 3z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M6.5 9.5H4V20h2.5V9.5zM5.25 4A1.75 1.75 0 1 0 5.26 7.5 1.75 1.75 0 0 0 5.25 4zM20 20h-2.5v-5.6c0-1.55-.55-2.6-1.92-2.6-1.05 0-1.67.7-1.95 1.38-.1.24-.12.58-.12.92V20H11V9.5h2.4v1.44h.03c.4-.72 1.36-1.72 3.05-1.72 2.22 0 3.52 1.45 3.52 4.56V20z" />
    </svg>
  )
}

function MemberCard({ member, index }) {
  const ref = useReveal()

  return (
    <article
      ref={ref}
      className={`reveal group border border-forest-800/10 bg-white transition duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_20px_50px_rgba(12,31,24,0.1)] ${
        index % 3 === 1 ? 'reveal-delay-1' : index % 3 === 2 ? 'reveal-delay-2' : ''
      }`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-forest-900">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
          {member.role}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-forest-900">
          {member.name}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">{member.bio}</p>

        <div className="mt-5 space-y-2.5 border-t border-forest-800/10 pt-4">
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2.5 text-sm text-forest-800 transition hover:text-gold-600"
          >
            <MailIcon />
            <span className="truncate">{member.email}</span>
          </a>
          <a
            href={`tel:${member.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2.5 text-sm text-forest-800 transition hover:text-gold-600"
          >
            <PhoneIcon />
            <span>{member.phone}</span>
          </a>
          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 text-sm text-forest-800 transition hover:text-gold-600"
          >
            <LinkedInIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Team() {
  const headerRef = useReveal()

  return (
    <div className="bg-mist">
      <section className="relative overflow-hidden bg-forest-950 pb-12 pt-24 text-white sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.16),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(31,122,77,0.35),transparent_40%)]" />
        <div ref={headerRef} className="reveal relative mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400 transition hover:text-gold-400/80"
          >
            ← Back to home
          </Link>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
            Our team
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
            A youth-driven AgTech team building affordable cold-chain, IoT
            quality proof, and market access for Rwanda’s smallholder farmers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {teamMembers.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
