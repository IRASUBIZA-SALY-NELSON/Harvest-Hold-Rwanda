export function Kpi({ label, value, hint, accent }) {
  return (
    <div className="border-t border-forest-800/15 bg-white px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold tracking-tight ${accent || 'text-forest-900'}`}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink/45">{hint}</p> : null}
    </div>
  )
}

export function Panel({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`bg-white ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-forest-800/10 px-4 py-3 sm:px-5">
        <div>
          <h2 className="font-display text-lg font-semibold text-forest-900 sm:text-xl">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-ink/45">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}

export function LiveBadge({ refreshedAt, error }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`inline-block h-2 w-2 rounded-full ${error ? 'bg-alert' : 'animate-pulse bg-forest-500'}`}
      />
      <span className={error ? 'text-alert' : 'text-ink/50'}>
        {error
          ? 'Offline'
          : refreshedAt
            ? `Live · ${refreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
            : 'Connecting…'}
      </span>
    </div>
  )
}

export function PageHeader({ title, subtitle, right }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 border-b border-forest-800/10 bg-white/80 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-forest-900 sm:text-3xl">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-sm text-ink/55">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  )
}

export function EmptyState({ message }) {
  return <p className="py-8 text-center text-sm text-ink/45">{message}</p>
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 border border-alert/25 bg-orange-50 px-4 py-3 text-sm text-alert sm:mx-6 lg:mx-8">
      <span>{message}</span>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="font-semibold underline">
          Retry
        </button>
      ) : null}
    </div>
  )
}
