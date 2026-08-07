import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const homeLinks = [
  { href: '/#mission', label: 'Mission' },
  { href: '/#problem', label: 'Challenge' },
  { href: '/#solution', label: 'Solution' },
  { href: '/#technology', label: 'Technology' },
  { href: '/#impact', label: 'Impact' },
  { href: '/team', label: 'Team' },
  { href: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'bg-forest-950/95 shadow-[0_8px_30px_rgba(6,20,15,0.25)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4 lg:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={() => setOpen(false)}>
          <img
            src="/brand/harvest-hold-rwanda-mark-transparent.png"
            alt="Harvest Hold Rwanda"
            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-base font-semibold tracking-wide text-white sm:text-lg">
              Harvest Hold
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold-400 sm:text-[11px]">
              Rwanda
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex xl:gap-7">
          {homeLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-white/75 transition hover:text-gold-400"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/#contact"
            className="rounded-sm bg-gold-500 px-4 py-2 text-sm font-semibold text-forest-950 transition hover:bg-gold-400"
          >
            Partner with us
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 origin-center bg-white transition ${open ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-6 origin-center bg-white transition ${open ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </div>
        </button>
      </nav>

      {open && (
        <div className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-white/10 bg-forest-950/98 px-4 py-5 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-1">
            {homeLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-3 text-base font-medium text-white/90 transition hover:bg-white/5 hover:text-gold-400"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/#contact"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-sm bg-gold-500 px-4 py-3 text-center text-sm font-semibold text-forest-950 transition hover:bg-gold-400"
            >
              Partner with us
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
