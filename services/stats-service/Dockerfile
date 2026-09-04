# ขั้นตอนที่ 1: ติดตั้งแพ็กเกจสำหรับอิมเมจของ service
FROM python:3.12-slim AS builder

ENV VIRTUAL_ENV=/opt/venv
WORKDIR /build

# คัดลอกรายการแพ็กเกจก่อน source code เพื่อให้ Docker ใช้ชั้นแคชได้มีประสิทธิภาพ
COPY requirements.txt ./requirements.txt

RUN python -m venv "${VIRTUAL_ENV}" \
    && "${VIRTUAL_ENV}/bin/pip" install --no-cache-dir -r requirements.txt

# ขั้นตอนที่ 2: รันเฉพาะ service และสภาพแวดล้อมที่เตรียมไว้
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:${PATH}"

WORKDIR /app

# คัดลอกสภาพแวดล้อมเสมือนจากขั้นตอนแรกและแอปพลิเคชัน FastAPI
COPY --from=builder /opt/venv /opt/venv
COPY app.py ./app.py

# กำหนดพอร์ตของ container ให้ตรงกับคำสั่ง Uvicorn ด้านล่าง
EXPOSE 8000

# รัน service ด้วยผู้ใช้ที่ไม่ใช่ root
USER nobody

# เริ่มต้นแอปพลิเคชัน FastAPI ด้วย Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
