# Reflection (Post-quiz 6)

## 1. Dockerfile Refinement (B1)
จากการดราฟต์ Dockerfile ในคาบบรรยาย เราได้นำมาปรับปรุงเป็น Production-grade Dockerfile โดยใช้เทคนิค **Multi-stage build** บน Base image `python:3.11-slim`:
* **Layer Caching & Optimization:** แยกขั้นตอนการติดตั้ง Dependencies (Stage `builder`) ออกจาก Runtime Environment (Stage `runner`) ทำให้ Image มีขนาดกะทัดรัด (ไม่เกินเกณฑ์ 500 MB) และลดเวลาในการ Build
* **Security & Non-root User:** เปลี่ยนจากการรันด้วย `root` ไปใช้ `USER appuser` เพื่อลด Attack Surface และปิดช่องโหว่ด้านความปลอดภัยตามแนวคิด Least Privilege (ESP §7)
* **Configuration:** ไม่คัดลอกไฟล์ `.env` เข้าไปใน Image เพื่อป้องกัน Secret Leakage โดยส่งค่าผ่าน Environment Variables (`-e`) ขณะสั่ง `docker run` แทน

---

## 2. Service Decomposition & Rule of Twos (B2)
ทีมของเราเลือกนำ **`stats-service`** มาทำ Containerize ซึ่งผ่านการตรวจสอบตามเกณฑ์ **Microservices Rule of Twos** (ESP §6):
* **Data Boundary:** Service นี้จัดการข้อมูลสถิติและการประมวลผลเฉพาะด้านอย่างเป็นเอกเทศ ไม่แชร์ Database ตรงกับ Service อื่น
* **Independent Scalability:** เนื่องจากเป็น Stateless Service การแยกเป็น Container ทำให้ทีมสามารถ Deploy, Scale เพื่อรองรับภาระงานเฉพาะส่วน หรือ Rollback ได้อย่างอิสระโดยไม่กระทบต่อ Core Service อื่นๆ ของระบบ

---

## 3. REST Endpoint Consistency
Endpoint ภายใน Container ถูกรันผ่าน Uvicorn Web Server ที่พอร์ต `8000` โดยมีการทำ Port Mapping ออกมาให้เข้าถึงได้ผ่าน Localhost อย่างถูกต้อง:
* Service ส่งผลลัพธ์สถานะเป็น **HTTP 2xx (200 OK)** เมื่อระบบพร้อมทำงาน
* โครงสร้างของ Containerized Service นี้ถูกออกแบบให้เป็นไปตามมาตรฐาน RESTful API พร้อมที่จะเชื่อมต่อผ่าน API Gateway หรือนำไปทำ Orchestration ร่วมกับ Service อื่นๆ ในระบบ Cloud ต่อไป