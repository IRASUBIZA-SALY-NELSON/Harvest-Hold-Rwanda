import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../api/client'
import { useLiveData } from '../hooks/useLiveData'
import { statusClass } from '../lib/format'
import { EmptyState, ErrorBanner, LiveBadge, PageHeader, Panel } from '../components/ui'

export default function FleetPage() {
  const { data, error, loading, refreshedAt, refresh } = useLiveData(api.units, 4000)
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('all')

  const units = useMemo(() => {
    const list = data || []
    if (filter === 'all') return list
    return list.filter((u) => (u.status || '').toLowerCase() === filter)
  }, [data, filter])

  const selected = useMemo(() => {
    const list = data || []
    return list.find((u) => u.id === selectedId) || list[0] || null
  }, [data, selectedId])

  const tempSeries = (selected?.history || []).map((v, i, arr) => ({
    t: `T-${arr.length - i}`,
    value: v,
  }))
  const humiditySeries = (selected?.humidityHistory || []).map((v, i, arr) => ({
    t: `T-${arr.length - i}`,
    value: v,
  }))

  return (
    <div>
      <PageHeader
        title="Cooling fleet"
        subtitle="Every SHCCS chamber with live sensor streams"
        right={<LiveBadge refreshedAt={refreshedAt} error={error} />}
      />
      <ErrorBanner message={error} onRetry={() => refresh(false)} />

      <div className="flex flex-wrap gap-2 px-4 pt-4 sm:px-6 lg:px-8">
        {['all', 'cooling', 'alert', 'idle'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f
                ? 'bg-forest-900 text-white'
                : 'bg-white text-ink/60 hover:text-forest-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && !data ? (
        <p className="px-6 py-16 text-center text-sm text-ink/45">Loading fleet…</p>
      ) : (
        <div className="grid gap-5 px-4 py-5 lg:grid-cols-[1.1fr_0.9fr] sm:px-6 lg:px-8">
          <Panel title="Units" subtitle={`${units.length} showing`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-forest-800/10 text-[11px] uppercase tracking-wider text-ink/40">
                    <th className="pb-2 font-medium">Unit</th>
                    <th className="pb-2 font-medium">Farmer</th>
                    <th className="pb-2 font-medium">Temp</th>
                    <th className="pb-2 font-medium">RH</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedId(u.id)}
                      className={`cursor-pointer border-b border-forest-800/5 transition hover:bg-forest-50 ${
                        selected?.id === u.id ? 'bg-forest-50' : ''
                      }`}
                    >
                      <td className="py-3">
                        <p className="font-medium text-forest-900">{u.name}</p>
                        <p className="text-xs text-ink/45">{u.id}</p>
                      </td>
                      <td className="py-3">
                        <p>{u.farmerName}</p>
                        <p className="text-xs text-ink/45">{u.district}</p>
                      </td>
                      <td className="py-3 font-display text-base">{u.temp}°</td>
                      <td className="py-3">{u.humidity}%</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusClass(u.status)}`}>
                          {u.status}
                        </span>
                        {!u.online ? (
                          <span className="ml-1 text-[10px] font-semibold text-ink/40">OFF</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!units.length ? <EmptyState message="No units match this filter" /> : null}
            </div>
          </Panel>

          <div className="space-y-5">
            <Panel title={selected?.name || 'Unit detail'} subtitle={selected?.id}>
              {selected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Meta label="Farmer" value={selected.farmerName} />
                    <Meta label="Cooperative" value={selected.cooperative} />
                    <Meta label="Crop" value={selected.crop} />
                    <Meta label="Crates" value={selected.crates} />
                    <Meta label="Battery" value={`${selected.battery}%`} />
                    <Meta label="Water" value={`${selected.waterLevel}%`} />
                    <Meta label="Ethylene" value={`${selected.ethylene} · ${selected.ethylenePpm} ppm`} />
                    <Meta label="Last sync" value={selected.lastSync} />
                  </div>
                  <p className="text-xs text-ink/45">{selected.location}</p>
                </div>
              ) : (
                <EmptyState message="Select a unit" />
              )}
            </Panel>

            <Panel title="Temperature history" subtitle="Live sensor trail">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tempSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e3dc" />
                    <XAxis dataKey="t" hide />
                    <YAxis tick={{ fontSize: 10, fill: '#6b7c73' }} width={32} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#1f7a4d"
                      fill="#1f7a4d33"
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Humidity history" subtitle="Live sensor trail">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={humiditySeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e3dc" />
                    <XAxis dataKey="t" hide />
                    <YAxis tick={{ fontSize: 10, fill: '#6b7c73' }} width={32} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#d4af37"
                      fill="#d4af3733"
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  )
}

function Meta({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/40">{label}</p>
      <p className="mt-0.5 text-forest-900">{value}</p>
    </div>
  )
}
