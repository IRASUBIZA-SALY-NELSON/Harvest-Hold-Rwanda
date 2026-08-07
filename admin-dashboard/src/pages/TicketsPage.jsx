import { useState } from 'react'
import { api } from '../api/client'
import { useLiveData } from '../hooks/useLiveData'
import { ticketStatusClass } from '../lib/format'
import { EmptyState, ErrorBanner, LiveBadge, PageHeader, Panel } from '../components/ui'

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed']

export default function TicketsPage() {
  const { data, error, loading, refreshedAt, refresh } = useLiveData(api.tickets, 5000)
  const [busyId, setBusyId] = useState(null)

  async function updateStatus(id, status) {
    setBusyId(id)
    try {
      await api.updateTicket(id, status)
      await refresh(true)
    } catch (e) {
      alert(e.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Support tickets"
        subtitle="Farmer help requests from the mobile app"
        right={<LiveBadge refreshedAt={refreshedAt} error={error} />}
      />
      <ErrorBanner message={error} onRetry={() => refresh(false)} />

      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <Panel title="Queue" subtitle={data ? `${data.length} tickets` : undefined}>
          {loading && !data ? (
            <EmptyState message="Loading tickets…" />
          ) : (
            <div className="space-y-4">
              {(data || []).map((t) => (
                <div key={t.id} className="border border-forest-800/10 bg-cloud/60 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-semibold text-forest-900">{t.topic}</p>
                      <p className="mt-1 text-xs text-ink/45">
                        {t.farmerName} · {t.unitId || 'No unit'} · #{t.id}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${ticketStatusClass(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{t.details}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={busyId === t.id || t.status === s}
                        onClick={() => updateStatus(t.id, s)}
                        className={`px-2.5 py-1 text-xs font-semibold transition ${
                          t.status === s
                            ? 'bg-forest-900 text-white'
                            : 'bg-white text-ink/60 hover:text-forest-800 disabled:opacity-40'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!data?.length ? <EmptyState message="No tickets yet" /> : null}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
