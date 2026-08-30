import { useEffect, useState } from 'react'
import { API_BASE_URL, fetchApi } from './api.js'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [activities, setActivities] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    async function loadDashboard() {
      try {
        const [usersResponse, activitiesResponse] = await Promise.all([
          fetchApi('/api/users'),
          fetchApi('/api/activities'),
        ])

        if (!ignore) {
          setUsers(usersResponse)
          setActivities(activitiesResponse)
          setStatus('ready')
        }
      } catch (error) {
        console.error(error)

        if (!ignore) {
          setStatus('error')
        }
      }
    }

    loadDashboard()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">OctoFit Tracker</p>
        <h1>Team fitness, live from the API.</h1>
        <p className="hero-copy">
          Connected to <code>{API_BASE_URL}</code>
        </p>
      </section>

      <section className="status-strip" aria-live="polite">
        <span className={`status-dot ${status}`}></span>
        <span>{status === 'ready' ? 'API connected' : status === 'error' ? 'API unavailable' : 'Loading API data'}</span>
      </section>

      <section className="data-grid">
        <article className="data-card">
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                <strong>{user.displayName}</strong>
                <span>{user.fitnessGoal}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="data-card">
          <h2>Activities</h2>
          <ul>
            {activities.map((activity) => (
              <li key={activity._id}>
                <strong>{activity.type}</strong>
                <span>{activity.minutes} min | {activity.calories} cal</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}

export default App
