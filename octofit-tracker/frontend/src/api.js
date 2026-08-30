const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export const isCodespaceApiConfigured = Boolean(codespaceName)

export function normalizeCollection(response, collectionKey) {
  if (Array.isArray(response)) {
    return response
  }

  if (!response || typeof response !== 'object') {
    return []
  }

  const candidates = [collectionKey, 'results', 'items', 'data', 'records']
  const collection = candidates.map((key) => response[key]).find(Array.isArray)

  if (collection) {
    return collection
  }

  if (response.data && typeof response.data === 'object') {
    return normalizeCollection(response.data, collectionKey)
  }

  return []
}

export function componentEndpoint(componentName) {
  return `/api/${componentName}/`
}

export async function fetchApi(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const response = await fetch(`${API_BASE_URL}${normalizedPath}`)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchCollection(componentName) {
  const response = await fetchApi(componentEndpoint(componentName))

  return normalizeCollection(response, componentName)
}