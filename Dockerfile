# syntax=docker/dockerfile:1

# ขั้นตอนที่ 1: ติดตั้งแพ็กเกจ Python ในสภาพแวดล้อมเสมือนที่แยกไว้
FROM python:3.12-slim AS builder

ENV VIRTUAL_ENV=/opt/venv
WORKDIR /build

# คัดลอกรายการแพ็กเกจก่อน เพื่อให้ Docker ใช้ชั้นแคชนี้ซ้ำได้เมื่อ source code ไม่เปลี่ยน
COPY services/stats-service/requirements.txt ./requirements.txt

RUN python -m venv "${VIRTUAL_ENV}" \
    && "${VIRTUAL_ENV}/bin/pip" install --no-cache-dir -r requirements.txt

# ขั้นตอนที่ 2: เก็บเฉพาะอิมเมจสำหรับรันและไฟล์แอปพลิเคชันที่จำเป็น
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:${PATH}"

WORKDIR /app

# คัดลอกสภาพแวดล้อมที่เตรียมไว้และแอปพลิเคชัน FastAPI จาก service
COPY --from=builder /opt/venv /opt/venv
COPY services/stats-service/app.py ./app.py

# FastAPI/Uvicorn รับคำขอที่พอร์ตนี้ภายใน container
EXPOSE 8000

# ลดสิทธิ์ของโพรเซส ไม่ให้แอปพลิเคชันทำงานด้วย root
USER nobody

# เริ่มต้น stats service ด้วย Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
