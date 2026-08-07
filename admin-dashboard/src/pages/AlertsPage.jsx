import { api } from '../api/client'
import { useLiveData } from '../hooks/useLiveData'
import { severityClass } from '../lib/format'
import { EmptyState, ErrorBanner, LiveBadge, PageHeader, Panel } from '../components/ui'

export default function AlertsPage() {
  const { data, error, loading, refreshedAt, refresh } = useLiveData(api.alerts, 4000)

  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle="Network-wide chamber and produce events"
        right={<LiveBadge refreshedAt={refreshedAt} error={error} />}
      />
      <ErrorBanner message={error} onRetry={() => refresh(false)} />

      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <Panel title="Event stream" subtitle={data ? `${data.length} alerts` : undefined}>
          {loading && !data ? (
            <EmptyState message="Loading alerts…" />
          ) : (
            <div className="divide-y divide-forest-800/10">
              {(data || []).map((a) => (
                <div key={a.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
                  <div className="flex shrink-0 items-start gap-2 sm:w-36 sm:flex-col">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${severityClass(a.severity)}`}>
                      {a.severity}
                    </span>
                    <span className="text-xs text-ink/40">{a.time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest-900">{a.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">{a.message}</p>
                    <p className="mt-2 text-xs text-ink/45">
                      {a.farmerName} · {a.unitName} ({a.unitId})
                      {!a.read ? (
                        <span className="ml-2 font-semibold text-alert">Unread</span>
                      ) : null}
                    </p>
                  </div>
                </div>
              ))}
              {!data?.length ? <EmptyState message="No alerts yet" /> : null}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
