import { useEffect, useState } from 'react'
import { componentEndpoint, fetchCollection } from '../api.js'

function Activities() {
  const [activities, setActivities] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    async function loadActivities() {
      try {
        const records = await fetchCollection('activities')

        if (!ignore) {
          setActivities(records)
          setStatus('ready')
        }
      } catch (error) {
        console.error(error)

        if (!ignore) {
          setStatus('error')
        }
      }
    }

    loadActivities()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Logs</p>
          <h2>Activities</h2>
        </div>
        <code>{componentEndpoint('activities')}</code>
      </div>

      <StatusMessage status={status} empty={!activities.length} label="activities" />

      <div className="record-grid">
        {activities.map((activity, index) => (
          <article className="record-card" key={activity._id ?? activity.id ?? index}>
            <div>
              <h3>{activity.type ?? 'Activity'}</h3>
              <p>{formatDate(activity.completedAt)}</p>
            </div>
            <div className="metric-row">
              <span className="metric-pill">{activity.minutes ?? 0} min</span>
              <span className="metric-pill">{activity.calories ?? 0} cal</span>
              {activity.distanceMiles ? <span className="metric-pill">{activity.distanceMiles} mi</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function formatDate(value) {
  if (!value) {
    return 'No completion date'
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
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

export default Activities