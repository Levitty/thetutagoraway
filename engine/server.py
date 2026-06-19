"""
Tutagora engine HTTP API — the "brain" the JS UI calls.

Stdlib only (no pip install): run with
    python3 engine/server.py            # listens on 127.0.0.1:8077

Stateless by design. The JS app owns persistence (Supabase); it sends the
student's serialized state in and gets decisions + updated state back. That
keeps the brain a pure function of (state, evidence) and trivially scalable.

Endpoints (all POST JSON unless noted):
  GET  /health
  GET  /graph?subject=math            -> graph metadata
  POST /diagnostic/step               {subject, history}      -> {next_item, balances, complete}
  POST /diagnostic/finalize           {subject, history}      -> {state, profile}
  POST /record                        {subject, state, responses} -> {state, profile}
  POST /next-session                  {subject, state, n}     -> {recommendations}
  POST /profile                       {subject, state}        -> {profile}
"""
import json
import os
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, str(Path(__file__).resolve().parent))

from tutagora_engine import load_graph, StudentModel
from tutagora_engine.scheduler import Scheduler
from tutagora_engine.ability import AbilityEstimator
from tutagora_engine.diagnostic import DiagnosticSession

# Bind 0.0.0.0 in containers/hosts; honor the platform-provided PORT.
# Locally these default to a private loopback address.
HOST = os.environ.get("ENGINE_HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8077"))
_GRAPH_CACHE = {}


def get_graph(subject):
    if subject not in _GRAPH_CACHE:
        _GRAPH_CACHE[subject] = load_graph(subject)
    return _GRAPH_CACHE[subject]


def _now():
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------- handlers
def h_graph(subject):
    g = get_graph(subject)
    return {
        "subject": g.subject,
        "strands": g.strands,
        "grades": g.grades,
        "skill_count": len(g),
    }


def _replay_diagnostic(subject, history, start_grade=None):
    """Rebuild a DiagnosticSession from the answer history (stateless)."""
    g = get_graph(subject)
    diag = DiagnosticSession(g, max_items=30, seed=12345, start_grade=start_grade)
    for h in history or []:
        diag.record(h["skill_id"], bool(h["correct"]), h.get("time_weight", 1.0))
    return g, diag


def h_diagnostic_step(body):
    g, diag = _replay_diagnostic(body["subject"], body.get("history"),
                                 start_grade=body.get("start_grade"))
    item = diag.next_item()
    return {
        "complete": diag.is_complete(),
        "answered": len(diag.answered),
        "max_items": diag.max_items,
        "balances": diag.balances,
        "next_item": None if item is None else {
            "skill_id": item.skill_id, "name": item.name,
            "grade": item.grade, "strand": item.strand, "weight": item.weight,
        },
    }


def h_diagnostic_finalize(body):
    g, diag = _replay_diagnostic(body["subject"], body.get("history"))
    sm = StudentModel(g)
    diag.finalize(sm, now=_now())
    return {"state": sm.to_dict(),
            "profile": AbilityEstimator(sm).profile(_now()).to_dict()}


def _load_student(body):
    g = get_graph(body["subject"])
    state = body.get("state")
    if state:
        return g, StudentModel.from_dict(g, state)
    return g, StudentModel(g)


def h_record(body):
    g, sm = _load_student(body)
    now = _now()
    for r in body.get("responses", []):
        sm.record_response(
            r["skill_id"], bool(r["correct"]),
            time_taken_ms=r.get("time_taken_ms"),
            expected_ms=r.get("expected_ms"),
            now=now,
        )
    return {"state": sm.to_dict(),
            "profile": AbilityEstimator(sm).profile(now).to_dict()}


def h_next_session(body):
    g, sm = _load_student(body)
    n = int(body.get("n", 8))
    plan = Scheduler(sm).next_session(n=n, now=_now())
    return {"recommendations": [r.to_dict() for r in plan]}


def h_profile(body):
    g, sm = _load_student(body)
    return {"profile": AbilityEstimator(sm).profile(_now()).to_dict()}


# Telemetry sink for self-hosted deployments (Supabase is the primary store).
# Appends events to engine/data/events.jsonl for the calibration job to read.
_EVENTS_PATH = Path(__file__).resolve().parent / "data" / "events.jsonl"


def h_event(body):
    events = body.get("events") or [body]
    with _EVENTS_PATH.open("a") as f:
        for ev in events:
            if ev.get("skill_id") and "correct" in ev:
                f.write(json.dumps(ev) + "\n")
    return {"ingested": len(events)}


ROUTES = {
    "/diagnostic/step": h_diagnostic_step,
    "/diagnostic/finalize": h_diagnostic_finalize,
    "/record": h_record,
    "/next-session": h_next_session,
    "/profile": h_profile,
    "/event": h_event,
}


# ---------------------------------------------------------------- http glue
class Handler(BaseHTTPRequestHandler):
    def _send(self, code, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(204, {})

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            return self._send(200, {"ok": True})
        if parsed.path == "/graph":
            subject = parse_qs(parsed.query).get("subject", ["math"])[0]
            try:
                return self._send(200, h_graph(subject))
            except Exception as e:
                return self._send(400, {"error": str(e)})
        return self._send(404, {"error": "not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        handler = ROUTES.get(parsed.path)
        if not handler:
            return self._send(404, {"error": "not found"})
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length) or b"{}")
            return self._send(200, handler(body))
        except KeyError as e:
            return self._send(400, {"error": f"missing field: {e}"})
        except Exception as e:
            return self._send(500, {"error": f"{type(e).__name__}: {e}"})

    def log_message(self, *args):
        pass  # quiet


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Tutagora engine listening on http://{HOST}:{PORT}")
    print("  GET  /health   GET /graph?subject=math")
    print("  POST /diagnostic/step  /diagnostic/finalize  /record  /next-session  /profile")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nbye")


if __name__ == "__main__":
    main()
