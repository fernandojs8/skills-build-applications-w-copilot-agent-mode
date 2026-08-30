import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { API_BASE_URL, isCodespaceApiConfigured } from './api.js'
import './App.css'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

const routes = [
  { path: '/users', label: 'Users', element: <Users /> },
  { path: '/teams', label: 'Teams', element: <Teams /> },
  { path: '/activities', label: 'Activities', element: <Activities /> },
  { path: '/leaderboard', label: 'Leaderboard', element: <Leaderboard /> },
  { path: '/workouts', label: 'Workouts', element: <Workouts /> },
]

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">OctoFit Tracker</p>
          <h1>Team fitness command center</h1>
          <p className="hero-copy">
            API base: <code>{API_BASE_URL}</code>
          </p>
          {!isCodespaceApiConfigured && (
            <p className="env-warning" role="status">
              Set <code>VITE_CODESPACE_NAME</code> to use the Codespaces API URL.
            </p>
          )}
        </div>

        <nav className="nav-tabs" aria-label="OctoFit sections">
          {routes.map((route) => (
            <NavLink key={route.path} to={route.path}>
              {route.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </main>
  )
}

export default App
