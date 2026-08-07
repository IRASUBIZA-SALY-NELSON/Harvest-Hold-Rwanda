import { api } from '../api/client'
import { useLiveData } from '../hooks/useLiveData'
import { EmptyState, ErrorBanner, LiveBadge, PageHeader, Panel } from '../components/ui'

export default function FarmersPage() {
  const { data, error, loading, refreshedAt, refresh } = useLiveData(api.farmers, 8000)

  return (
    <div>
      <PageHeader
        title="Farmers"
        subtitle="Cooperative members connected to SHCCS units"
        right={<LiveBadge refreshedAt={refreshedAt} error={error} />}
      />
      <ErrorBanner message={error} onRetry={() => refresh(false)} />

      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <Panel title="Roster" subtitle={data ? `${data.length} farmers` : undefined}>
          {loading && !data ? (
            <EmptyState message="Loading farmers…" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-forest-800/10 text-[11px] uppercase tracking-wider text-ink/40">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Phone</th>
                    <th className="pb-2 font-medium">Cooperative</th>
                    <th className="pb-2 font-medium">District</th>
                    <th className="pb-2 font-medium">Units</th>
                    <th className="pb-2 font-medium">Unread</th>
                  </tr>
                </thead>
                <tbody>
                  {(data || []).map((f) => (
                    <tr key={f.id} className="border-b border-forest-800/5">
                      <td className="py-3">
                        <p className="font-medium text-forest-900">{f.name}</p>
                        <p className="text-xs text-ink/45">{f.village}</p>
                      </td>
                      <td className="py-3">{f.phone}</td>
                      <td className="py-3">{f.cooperative}</td>
                      <td className="py-3">{f.district}</td>
                      <td className="py-3 font-display text-base">{f.units}</td>
                      <td className="py-3">
                        <span className={f.unreadAlerts > 0 ? 'font-semibold text-alert' : 'text-ink/45'}>
                          {f.unreadAlerts}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data?.length ? <EmptyState message="No farmers seeded" /> : null}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
