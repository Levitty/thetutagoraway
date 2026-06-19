# Deploying HOREB (the engine)

The React app is static files — it stays on your current hosting. Only the
**Python engine** needs a place to run a long-lived process with a public HTTPS
URL. The easiest, free, hosting-agnostic option is Render. Two parts:

---

## 1. Host the engine (Render, free)

The repo already has everything: `engine/Dockerfile` and `render.yaml`.

1. Push this repo to GitHub (if it isn't already).
2. Go to **render.com → New → Blueprint** and connect the repo.
   Render reads `render.yaml` and creates a Docker web service called
   `horeb-engine`. (Or: **New → Web Service**, root directory `engine`,
   environment **Docker** — same result.)
3. Deploy. You'll get a URL like `https://horeb-engine.onrender.com`.
4. **Verify:** open `https://horeb-engine.onrender.com/health` →
   should return `{"ok": true}`.

That's it — the engine is live. No pip install, no servers to manage.

> Free tier note: the service sleeps when idle, so the first request after a
> while takes ~30–50s to wake. The app's availability check times out fast and
> falls back to the JS engine during that wake-up, so users never see an error.
> For always-on, switch the Render plan from `free` to a paid instance later.

---

## 2. Point the app at the engine

Wherever you build/deploy the **React app**, add one build-time env var:

```
VITE_ENGINE_URL=https://horeb-engine.onrender.com
```

- On a static host (Netlify/Vercel): set it in the site's Environment Variables,
  then redeploy.
- On cPanel/shared hosting where you upload a `dist/` folder: set the var before
  running `npm run build` locally, then upload the new `dist/`:
  ```
  VITE_ENGINE_URL=https://horeb-engine.onrender.com npm run build
  ```

`engineClient.js` already reads this var. If it's unset or unreachable, the app
uses the JS engine — so this change is safe and reversible.

---

## 3. (Recommended) Lock down CORS

The engine currently allows any origin (`Access-Control-Allow-Origin: *`) for
easy testing. For production, change that header in `engine/server.py` to your
site's origin, e.g.:

```python
self.send_header("Access-Control-Allow-Origin", "https://tutagora.com")
```

Then redeploy the engine.

---

## What about my existing hosting?

- **Shared / cPanel:** keep it for the React app (upload `dist/`). Use Render for
  the engine as above. Don't try to run Python on shared hosting.
- **VPS (you have SSH):** you *can* run the engine there instead of Render —
  `python3 engine/server.py` behind nginx with a TLS cert (Caddy/Let's Encrypt),
  or `docker build -t horeb engine && docker run -e PORT=8077 -p 8077:8077 horeb`.
  Render is still simpler to start with.

---

## Later: the data loop in production

Once students are using the live engine, telemetry fills `response_events`
(Supabase). Then run the calibration job with the service-role key to tune
HOREB to real usage:

```
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... python3 engine/scripts/calibrate.py
# review engine/data/params.preview.json, then:
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... python3 engine/scripts/calibrate.py --commit
```

Commit `engine/data/params.v1.json` and redeploy the engine to ship the
calibrated parameters.
