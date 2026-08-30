import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const teamsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

function Teams() {
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    async function loadTeams() {
      try {
        const records = await fetchCollection(teamsApiUrl, 'teams')

        if (!ignore) {
          setTeams(records)
          setStatus('ready')
        }
      } catch (error) {
        console.error(error)

        if (!ignore) {
          setStatus('error')
        }
      }
    }

    loadTeams()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Groups</p>
          <h2>Teams</h2>
        </div>
        <code>{teamsApiUrl}</code>
      </div>

      <StatusMessage status={status} empty={!teams.length} label="teams" />

      <div className="record-grid">
        {teams.map((team, index) => (
          <article className="record-card" key={team._id ?? team.id ?? team.name ?? index}>
            <div>
              <h3>{team.name ?? 'Unnamed team'}</h3>
              <p>{team.description ?? 'No description provided'}</p>
            </div>
            <span className="metric-pill">{team.city ?? 'Remote'}</span>
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

export default Teams