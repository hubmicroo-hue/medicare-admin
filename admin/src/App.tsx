import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth, Perm } from './lib/auth'
import { Layout } from './components/Layout'
import { Spinner } from './components/ui'
import { RESOURCES } from './features/resources'
import ResourcePage from './features/ResourcePage'

const Login = lazy(() => import('./features/Login'))
const Dashboard = lazy(() => import('./features/Dashboard'))
const Approvals = lazy(() => import('./features/Approvals'))
const Settings = lazy(() => import('./features/Settings'))

function Guard({ perm, children }: { perm: Perm; children: JSX.Element }) {
  const { user, can } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!can(perm)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { user } = useAuth()
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} />
          <Route path="approvals" element={<Guard perm="read"><Approvals /></Guard>} />
          <Route path="settings" element={<Guard perm="settings"><Settings /></Guard>} />
          {RESOURCES.map((r) => (
            <Route key={r.key} path={r.key} element={<Guard perm={r.perm}><ResourcePage cfg={r} /></Guard>} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
