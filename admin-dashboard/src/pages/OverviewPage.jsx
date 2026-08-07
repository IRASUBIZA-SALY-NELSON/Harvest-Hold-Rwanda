import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useLiveData } from '../hooks/useLiveData'
import { severityClass, statusClass } from '../lib/format'
import { EmptyState, ErrorBanner, Kpi, LiveBadge, PageHeader, Panel } from '../components/ui'

const CHART = {
  forest: '#1f7a4d',
  forestSoft: '#2d9a63',
  gold: '#d4af37',
  alert: '#c45c26',
  mist: '#eef3f0',
  ink: '#14201a',
}

const tooltipStyle = {
  background: '#0c1f18',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 0,
  fontSize: 12,
  color: '#fff',
}

export default function OverviewPage() {
  const { data, error, loading, refreshedAt, refresh } = useLiveData(api.overview, 4000)
  const kpis = data?.kpis

  const statusData = Object.entries(data?.statusBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }))
  const districtData = Object.entries(data?.districtBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }))
  const severityData = Object.entries(data?.severityBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }))

  const statusColors = {
    cooling: CHART.forest,
    alert: CHART.alert,
    idle: '#8a9a91',
    unknown: '#c5cfc9',
  }

  return (
    <div>
      <PageHeader
        title="Network overview"
        subtitle="Live SHCCS fleet telemetry across cooperatives"
        right={<LiveBadge refreshedAt={refreshedAt} error={error} />}
      />
      <ErrorBanner message={error} onRetry={() => refresh(false)} />

      {loading && !data ? (
        <p className="px-6 py-16 text-center text-sm text-ink/45">Loading live telemetry…</p>
      ) : (
        <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-px overflow-hidden bg-forest-800/10 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Cooling units" value={kpis?.units ?? '—'} hint={`${kpis?.online ?? 0} online`} />
            <Kpi label="Farmers" value={kpis?.farmers ?? '—'} hint={`${kpis?.totalCrates ?? 0} crates stored`} />
            <Kpi
              label="Need attention"
              value={kpis?.alerting ?? '—'}
              hint={`${kpis?.unreadAlerts ?? 0} unread alerts`}
              accent="text-alert"
            />
            <Kpi
              label="Avg chamber"
              value={kpis ? `${kpis.avgTemp}°C` : '—'}
              hint={kpis ? `${kpis.avgHumidity}% RH · ${kpis.openTickets} open tickets` : undefined}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel title="Fleet temperature trend" subtitle="Network average · last samples">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.tempSeries || []}>
                    <defs>
                      <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART.forest} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={CHART.forest} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e3dc" />
                    <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#6b7c73' }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#6b7c73' }} unit="°" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Avg °C"
                      stroke={CHART.forest}
                      fill="url(#tempFill)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Fleet humidity trend" subtitle="Network average · last samples">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.humiditySeries || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e3dc" />
                    <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#6b7c73' }} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#6b7c73' }} unit="%" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Avg RH %"
                      stroke={CHART.gold}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Panel title="Unit status" subtitle="Live mix">
              <div className="h-56">
                {statusData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={78}
                        paddingAngle={2}
                        isAnimationActive={false}
                      >
                        {statusData.map((entry) => (
                          <Cell key={entry.name} fill={statusColors[entry.name] || CHART.forestSoft} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No units yet" />
                )}
              </div>
            </Panel>

            <Panel title="Farmers by district" subtitle="Coverage footprint">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e3dc" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7c73' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7c73' }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" name="Farmers" fill={CHART.forest} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Alert severity" subtitle="All-time in session">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e3dc" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7c73' }} />
                    <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11, fill: '#6b7c73' }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" name="Alerts" fill={CHART.alert} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel
              title="Chamber snapshot"
              subtitle="Current temp vs target band"
              action={
                <Link to="/fleet" className="text-xs font-semibold text-forest-600 hover:text-forest-800">
                  View fleet →
                </Link>
              }
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.fleetTemps || []} margin={{ bottom: 28 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e3dc" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-28}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 10, fill: '#6b7c73' }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7c73' }} unit="°" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="temp" name="°C" isAnimationActive={false}>
                      {(data?.fleetTemps || []).map((row) => (
                        <Cell
                          key={row.id}
                          fill={
                            row.status === 'alert'
                              ? CHART.alert
                              : row.temp > row.targetMax
                                ? CHART.gold
                                : CHART.forest
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel
              title="Recent alerts"
              subtitle="Newest network events"
              action={
                <Link to="/alerts" className="text-xs font-semibold text-forest-600 hover:text-forest-800">
                  All alerts →
                </Link>
              }
            >
              <div className="divide-y divide-forest-800/10">
                {(data?.recentAlerts || []).length === 0 ? (
                  <EmptyState message="No alerts" />
                ) : (
                  (data?.recentAlerts || []).map((a) => (
                    <div key={a.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                      <span
                        className={`mt-0.5 h-fit px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityClass(a.severity)}`}
                      >
                        {a.severity}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-forest-900">{a.title}</p>
                        <p className="mt-0.5 text-xs text-ink/50">
                          {a.unitName} · {a.time}
                        </p>
                      </div>
                      <span className={`h-fit px-2 py-0.5 text-[10px] font-semibold ${statusClass(a.read ? 'idle' : 'alert')}`}>
                        {a.read ? 'Read' : 'New'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  )
}
