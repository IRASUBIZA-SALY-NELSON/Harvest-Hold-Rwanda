import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-forest-950 px-4 py-8 text-white sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <p className="font-display text-lg font-semibold sm:text-xl">Harvest Hold Rwanda</p>
          <p className="mt-1 text-xs leading-relaxed text-white/50 sm:text-sm">
            Empowering smallholders · Sustainable cold-chain · AI market intelligence
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link to="/team" className="text-white/60 transition hover:text-gold-400">
            Team
          </Link>
          <Link to="/#contact" className="text-white/60 transition hover:text-gold-400">
            Contact
          </Link>
          <p className="w-full text-white/40 sm:w-auto">
            © {new Date().getFullYear()} Harvest Hold Rwanda
          </p>
        </div>
      </div>
    </footer>
  )
}
