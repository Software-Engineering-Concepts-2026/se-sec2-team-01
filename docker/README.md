# Docker Service Documentation — Stats Service

เอกสารนี้อธิบายการ build และ run `stats-service` ตามเกณฑ์ Lab 6 โดยใช้
`Dockerfile` ที่ root ของ repository เป็น entry point หลัก

## 1. Image specification

| รายการ | ค่า |
| --- | --- |
| Service | `stats-service` |
| Tag สำหรับส่งงาน | `v0.1.0` |
| Base image | `python:3.12-slim` |
| Build strategy | Multi-stage (`builder` และ `runtime`) |
| Runtime user | `nobody` (ไม่รันเป็น root) |
| Container port | `8000` |
| Image size | ต้องตรวจและบันทึกจาก `docker image ls` ก่อนส่ง; เกณฑ์คือไม่เกิน 500 MB |

Dockerfile จะติดตั้ง dependencies ใน stage `builder` แล้วคัดลอกเฉพาะ virtual environment
และ `services/stats-service/app.py` ไปยัง runtime image เพื่อลดไฟล์ที่ไม่จำเป็นใน final image

## 2. Build และ run จาก repository root

รันคำสั่งจากโฟลเดอร์ root ของ repository:

```bash
docker build -t <registry-user>/stats-service:v0.1.0 .
docker run --rm --name stats-service -p 8000:8000 <registry-user>/stats-service:v0.1.0
```

ตรวจ endpoint ใน terminal อีกหน้าต่าง:

```bash
curl -i http://localhost:8000/
curl -i http://localhost:8000/health
```

ผลที่ต้องตรวจด้วยตนเอง:

- `/` ตอบ `200` พร้อม `service=stats-service` และ `status=ok`
- `/health` ตอบ `200` พร้อม `status=healthy`
- container ทำงานด้วย user `nobody`
- image มีขนาดไม่เกิน 500 MB

ตรวจ image และ user ได้ด้วย:

```bash
docker image ls <registry-user>/stats-service:v0.1.0
docker inspect stats-service --format '{{.Config.User}}'
```

## 3. Push ขึ้น Registry

สมาชิกที่มีสิทธิ์ใน Docker Hub หรือ GHCR ต้อง login และ push หลังจาก build/run ผ่านแล้ว:

```bash
docker login
docker push <registry-user>/stats-service:v0.1.0
```

ห้ามใส่ password, token หรือ `.env` ลงใน image หรือ commit โดย `.dockerignore` จะกันไฟล์ดังกล่าวออกจาก build context

ก่อน merge PR ต้องแนบ screenshot หน้า image บน Registry ที่แสดงชื่อ image และ tag `v0.1.0`

## 4. ทำไมเลือก Container แทน VM

- Container ใช้ kernel ของ host ร่วมกัน จึงเริ่มทำงานเร็วและใช้ทรัพยากรน้อยกว่า VM ที่ต้องจำลอง guest operating system
- Image ทำให้ runtime และ dependency ของ `stats-service` ทำซ้ำได้เหมือนกันระหว่างเครื่องพัฒนาและ deployment
- ขอบเขตของ service ชัดเจนและรองรับการ deploy หรือ rollback แยกจากส่วนอื่นได้
- VM ยังเหมาะเมื่อจำเป็นต้องแยก operating system หรือ isolation ระดับเครื่อง แต่เกินความจำเป็นสำหรับ stateless API ขนาดเล็กใน Lab นี้

## 5. Handoff checklist

- [ ] `docker build` ผ่าน
- [ ] `/` และ `/health` ตอบ HTTP 200
- [ ] ตรวจ image size แล้วและบันทึกค่าจริงใน PR
- [ ] push image แบบ public พร้อม tag `v0.1.0`
- [ ] แนบ screenshot หน้า Docker Hub หรือ GHCR ใน PR
