import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Offline shell for the web build only. The iOS/Android shell already serves
// the bundle from the device, and a worker inside it would only fight
// Capacitor's own loader. Production only: in dev the worker is not built.
if (import.meta.env.PROD && 'serviceWorker' in navigator && !window.Capacitor?.isNativePlatform?.()) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => { /* no worker, no offline — the app still runs */ })
}
