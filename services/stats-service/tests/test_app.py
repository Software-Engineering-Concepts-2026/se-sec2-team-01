from app import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_service_info_contract():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "service": "stats-service",
        "status": "ok",
    }


def test_health_check_contract():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
