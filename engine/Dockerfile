# Tutagora engine — pure stdlib, so the image is tiny and has no pip step.
FROM python:3.11-slim

WORKDIR /app

# The engine package + the exported curriculum JSON (engine/data/*.json).
COPY tutagora_engine ./tutagora_engine
COPY data ./data
COPY server.py ./server.py

# Hosts inject PORT; bind all interfaces so the platform can reach us.
ENV ENGINE_HOST=0.0.0.0
ENV PORT=8077
EXPOSE 8077

CMD ["python3", "server.py"]
