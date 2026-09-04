# Stage 1: install dependencies for the service image.
FROM python:3.12-slim AS builder

ENV VIRTUAL_ENV=/opt/venv
WORKDIR /build

# Copy the dependency manifest before source code to improve layer caching.
COPY requirements.txt ./requirements.txt

RUN python -m venv "${VIRTUAL_ENV}" \
    && "${VIRTUAL_ENV}/bin/pip" install --no-cache-dir -r requirements.txt

# Stage 2: run only the service and its prepared environment.
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:${PATH}"

WORKDIR /app

# Copy the virtual environment from the builder and the FastAPI application.
COPY --from=builder /opt/venv /opt/venv
COPY app.py ./app.py

# Keep the container port aligned with the Uvicorn command below.
EXPOSE 8000

# Run the service as a non-root user.
USER nobody

# Start the FastAPI application with Uvicorn.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
