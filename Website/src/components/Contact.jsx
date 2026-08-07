import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

export default function Contact() {
  const ref = useReveal()
  const [status, setStatus] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = data.get('name')
    const email = data.get('email')
    const message = data.get('message')
    const subject = encodeURIComponent(`Harvest Hold inquiry from ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    )
    window.location.href = `mailto:info@harvesthold.rw?subject=${subject}&body=${body}`
    setStatus('Opening your email client…')
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-forest-900 py-16 text-white sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.12),transparent_50%)]" />
      <div ref={ref} className="reveal relative mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
              Contact
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              It is our turn.
            </h2>
            <p className="mt-4 font-display text-xl text-white/85 sm:mt-5 sm:text-2xl">
              Securing Rwanda’s harvest, one village at a time.
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65 sm:mt-6 sm:text-base">
              Questions, partnerships, pilot sites, or research collaboration —
              we would love to hear from you.
            </p>

            <div className="mt-10 space-y-4 text-sm">
              <p>
                <span className="text-white/45">Email</span>
                <br />
                <a
                  href="mailto:info@harvesthold.rw"
                  className="font-medium text-gold-400 hover:text-gold-400/80"
                >
                  info@harvesthold.rw
                </a>
              </p>
              <p>
                <span className="text-white/45">Web</span>
                <br />
                <span className="font-medium">www.harvesthold.rw</span>
              </p>
              <p>
                <span className="text-white/45">Location</span>
                <br />
                <span className="font-medium">Kigali, Rwanda</span>
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 border border-white/10 bg-forest-950/40 p-5 sm:p-8"
          >
            <div>
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-white/50">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-2 w-full border-b border-white/25 bg-transparent py-2 text-white outline-none transition focus:border-gold-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-white/50">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 w-full border-b border-white/25 bg-transparent py-2 text-white outline-none transition focus:border-gold-400"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-white/50">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="mt-2 w-full resize-y border-b border-white/25 bg-transparent py-2 text-white outline-none transition focus:border-gold-400"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full bg-gold-500 px-6 py-3 text-sm font-semibold text-forest-950 transition hover:bg-gold-400 sm:w-auto"
            >
              Send message
            </button>
            {status && <p className="text-sm text-gold-400">{status}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
