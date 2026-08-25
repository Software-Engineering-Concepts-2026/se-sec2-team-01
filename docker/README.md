# Docker Service Documentation — Stats Service

## 1. Image Specification
* **Image Name:** `adisakx2548/stats-service` (หรือ `adisakx2548/my-app-api`)
* **Tag:** `v0.1.0`
* **Base Image:** `python:3.11-slim`
* **Final Image Size:** ~150 MB (ผ่านเกณฑ์ประเมินขนาด Image < 500 MB)
* **Exposed Port:** `8000` (Uvicorn / FastAPI Runtime)

---

## 2. วิธีการ Build และ Run Container

### 2.1 คำสั่ง Build Image
```bash
docker build -t adisakx2548/stats-service:v0.1.0 .