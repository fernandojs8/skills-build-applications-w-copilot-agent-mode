const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = apiBaseUrl || (codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000')

export const isCodespaceApiConfigured = API_BASE_URL.includes('.app.github.dev')

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
  const url = /^https?:\/\//i.test(path)
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchCollection(path, collectionKey) {
  const response = await fetchApi(path)

  return normalizeCollection(response, collectionKey)
}