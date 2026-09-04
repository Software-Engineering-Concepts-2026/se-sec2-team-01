from typing import Final

from fastapi import FastAPI


SERVICE_NAME: Final[str] = "stats-service"
SERVICE_VERSION: Final[str] = "0.1.0"

app = FastAPI(
    title=SERVICE_NAME,
    version=SERVICE_VERSION,
)


def get_service_info_payload() -> dict[str, str]:
    return {
        "service": SERVICE_NAME,
        "status": "ok",
    }


def get_health_payload() -> dict[str, str]:
    return {"status": "healthy"}


@app.get("/")
def service_info() -> dict[str, str]:
    return get_service_info_payload()


@app.get("/health")
def health_check() -> dict[str, str]:
    return get_health_payload()
