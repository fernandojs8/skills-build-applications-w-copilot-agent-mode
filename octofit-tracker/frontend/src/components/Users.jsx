import { useEffect, useState } from 'react'
import { componentEndpoint, fetchCollection } from '../api.js'

function Users() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    async function loadUsers() {
      try {
        const records = await fetchCollection('users')

        if (!ignore) {
          setUsers(records)
          setStatus('ready')
        }
      } catch (error) {
        console.error(error)

        if (!ignore) {
          setStatus('error')
        }
      }
    }

    loadUsers()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Members</p>
          <h2>Users</h2>
        </div>
        <code>{componentEndpoint('users')}</code>
      </div>

      <StatusMessage status={status} empty={!users.length} label="users" />

      <div className="record-grid">
        {users.map((user, index) => (
          <article className="record-card" key={user._id ?? user.id ?? user.username ?? index}>
            <div>
              <h3>{user.displayName ?? user.username ?? 'Unnamed user'}</h3>
              <p>{user.email ?? 'No email provided'}</p>
            </div>
            <span className="metric-pill">{user.username ?? 'user'}</span>
            <p>{user.fitnessGoal ?? 'No fitness goal set'}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function StatusMessage({ status, empty, label }) {
  if (status === 'loading') {
    return <p className="status-text">Loading {label}...</p>
  }

  if (status === 'error') {
    return <p className="status-text error">Unable to load {label}.</p>
  }

  if (empty) {
    return <p className="status-text">No {label} found.</p>
  }

  return null
}

export default Users