import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const codespaceName = env.VITE_CODESPACE_NAME?.trim() || env.CODESPACE_NAME?.trim() || ''
  const apiBaseUrl = env.VITE_API_BASE_URL?.trim() || (codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000')

  return {
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
      'import.meta.env.VITE_CODESPACE_NAME': JSON.stringify(codespaceName),
    },
    plugins: [react()],
    optimizeDeps: {
      exclude: ['react-router-dom'],
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
    },
  }
})
