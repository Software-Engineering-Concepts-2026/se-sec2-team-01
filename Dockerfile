# syntax=docker/dockerfile:1

# Stage 1: install Python dependencies in an isolated virtual environment.
FROM python:3.12-slim AS builder

ENV VIRTUAL_ENV=/opt/venv
WORKDIR /build

# Copy the dependency manifest first so this layer can be cached independently.
COPY services/stats-service/requirements.txt ./requirements.txt

RUN python -m venv "${VIRTUAL_ENV}" \
    && "${VIRTUAL_ENV}/bin/pip" install --no-cache-dir -r requirements.txt

# Stage 2: keep only the runtime image and application files.
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:${PATH}"

WORKDIR /app

# Copy the prepared environment and the FastAPI application from the service.
COPY --from=builder /opt/venv /opt/venv
COPY services/stats-service/app.py ./app.py

# FastAPI/Uvicorn listens on this port inside the container.
EXPOSE 8000

# Drop root privileges for the application process.
USER nobody

# Start the stats service with Uvicorn.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
