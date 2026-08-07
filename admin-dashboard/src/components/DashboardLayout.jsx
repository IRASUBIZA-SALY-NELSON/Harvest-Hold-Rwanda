import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/', label: 'Overview', end: true },
  { to: '/fleet', label: 'Fleet' },
  { to: '/farmers', label: 'Farmers' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/tickets', label: 'Tickets' },
]

export default function DashboardLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-white/10 bg-forest-950 text-white lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <div>
            <p className="font-display text-xl font-semibold tracking-tight">Harvest Hold</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">
              Ops Dashboard
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="text-xs font-medium text-white/55 hover:text-gold-400 lg:mt-6 lg:block"
          >
            Sign out
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-6">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white/10 text-gold-400'
                    : 'text-white/65 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-white/10 px-5 py-4 lg:block">
          <p className="text-xs text-white/40">Signed in as</p>
          <p className="mt-1 text-sm font-medium text-white/90">{admin?.name}</p>
          <p className="text-xs text-white/45">{admin?.email}</p>
        </div>
      </aside>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
