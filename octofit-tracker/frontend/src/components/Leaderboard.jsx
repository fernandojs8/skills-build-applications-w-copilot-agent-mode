import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const leaderboardApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    async function loadLeaderboard() {
      try {
        const records = await fetchCollection(leaderboardApiUrl, 'leaderboard')

        if (!ignore) {
          setLeaderboard(records)
          setStatus('ready')
        }
      } catch (error) {
        console.error(error)

        if (!ignore) {
          setStatus('error')
        }
      }
    }

    loadLeaderboard()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Competition</p>
          <h2>Leaderboard</h2>
        </div>
        <code>{leaderboardApiUrl}</code>
      </div>

      <StatusMessage status={status} empty={!leaderboard.length} label="leaderboard entries" />

      <div className="table-responsive">
        <table className="table align-middle leaderboard-table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">User</th>
              <th scope="col">Points</th>
              <th scope="col">Weekly Minutes</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry._id ?? entry.id ?? index}>
                <td>#{entry.rank ?? index + 1}</td>
                <td>{entry.userName ?? entry.displayName ?? entry.userId ?? 'Athlete'}</td>
                <td>{entry.points ?? 0}</td>
                <td>{entry.weeklyMinutes ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default Leaderboard