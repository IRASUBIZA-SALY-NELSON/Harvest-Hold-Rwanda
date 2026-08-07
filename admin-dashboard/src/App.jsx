import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardLayout from './components/DashboardLayout'
import LoginPage from './pages/LoginPage'
import OverviewPage from './pages/OverviewPage'
import FleetPage from './pages/FleetPage'
import FarmersPage from './pages/FarmersPage'
import AlertsPage from './pages/AlertsPage'
import TicketsPage from './pages/TicketsPage'

function Protected({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <DashboardLayout />
            </Protected>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="farmers" element={<FarmersPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="tickets" element={<TicketsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
