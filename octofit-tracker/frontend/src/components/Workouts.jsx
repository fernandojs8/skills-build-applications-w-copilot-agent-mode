import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const workoutsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    async function loadWorkouts() {
      try {
        const records = await fetchCollection(workoutsApiUrl, 'workouts')

        if (!ignore) {
          setWorkouts(records)
          setStatus('ready')
        }
      } catch (error) {
        console.error(error)

        if (!ignore) {
          setStatus('error')
        }
      }
    }

    loadWorkouts()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Plans</p>
          <h2>Workouts</h2>
        </div>
        <code>{workoutsApiUrl}</code>
      </div>

      <StatusMessage status={status} empty={!workouts.length} label="workouts" />

      <div className="record-grid">
        {workouts.map((workout, index) => (
          <article className="record-card" key={workout._id ?? workout.id ?? workout.name ?? index}>
            <div>
              <h3>{workout.name ?? 'Workout'}</h3>
              <p>{workout.focus ?? 'General fitness'}</p>
            </div>
            <div className="metric-row">
              <span className="metric-pill">{workout.durationMinutes ?? 0} min</span>
              <span className="metric-pill">{workout.difficulty ?? 'all levels'}</span>
            </div>
            {workout.equipment?.length ? <p>Equipment: {workout.equipment.join(', ')}</p> : null}
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

export default Workouts