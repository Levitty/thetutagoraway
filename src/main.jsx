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
    .then(({ registerSW }) => registerSW({
      immediate: true,
      // A service worker only looks for a new version on a NAVIGATION, and
      // this is a single-page app: a tab left open on the practice screen —
      // which is exactly how a shared family tablet is used — never navigates
      // again and so never picks up a fix, however many times we deploy. Ask
      // it ourselves: hourly, and whenever the tab comes back to the front.
      //
      // The trade-off, stated plainly: registerType is 'autoUpdate', so a new
      // worker takes over and reloads the page. If that lands mid-question the
      // learner loses the answer they were typing — but only that, because
      // progress is written on every change, and the alternative is a device
      // that silently runs last month's build for ever.
      onRegisteredSW(_swUrl, registration) {
        if (!registration) return
        const check = () => { if (navigator.onLine) registration.update().catch(() => {}) }
        setInterval(check, 60 * 60 * 1000)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') check()
        })
      },
    }))
    .catch(() => { /* no worker, no offline — the app still runs */ })
}
