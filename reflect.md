# Reflection

## Lab 5 Reflection (Post-quiz 5)

### 1. ADR: เหตุผลต้องมาก่อนรายการ technology

การเขียน ADR ทำให้ทีมเห็นว่า tech stack ไม่ใช่รายการ library ที่เลือกตามความคุ้นเคย แต่เป็นคำตอบต่อ context ของ Good Night เช่น ทีมขนาดเล็กต้อง demo end-to-end, core scope ยังเป็น manual sleep log และต้องรักษาความถูกต้องของข้อมูลสุขภาพ เราจึงเลือก modular monolith สำหรับ core API และวาง Insight Service เป็น boundary ที่แยกได้ในอนาคต แทนการเริ่มด้วย full microservices ที่มี operational overhead สูงเกินความจำเป็นตอนนี้

### 2. C4: แยกมุมมอง system context กับ container

System Context ช่วยให้ทีมเห็นผู้ใช้ ต้นกับปุ๊ก และ external systems โดยไม่หลุดไปคุยเรื่อง implementation เร็วเกินไป ส่วน Container Diagram ช่วยระบุ responsibility ของ Web App, Backend API, Insight Service และ Sleep Database พร้อม protocol ระหว่างกัน การแยกสองระดับนี้ทำให้เห็นชัดว่า Web App ไม่ควรอ่าน database โดยตรง และทุกข้อมูลสุขภาพต้องผ่าน authorization boundary ของ API

### 3. Tech Stack: trade-off ต้องตรวจสอบต่อได้

เหตุผลของ PostgreSQL, Flask, React + Vite และ Docker Compose เชื่อมกับ NFR เรื่อง data integrity, response time, deploy ซ้ำได้ และการพัฒนา dashboard ไม่ใช่แค่คำว่า “ทีมถนัด” ขณะเดียวกันเราบันทึก trade-off ไว้ด้วย เช่น Flask ต้องกำหนด project structure เอง, PostgreSQL setup หนักกว่า SQLite และ OpenAI API เป็น optional adapter ไม่ใช่ dependency ของทุก acceptance criteria

### สิ่งที่จะปรับใน Sprint ถัดไป

ทีมจะ render Mermaid ใน PR preview และ cross-review ว่าชื่อ component, edge label, API boundary และ tech stack ตรงกับ implementation จริง ก่อนเริ่มแยก service หรือเพิ่ม external integration

---

## Lab 6 Reflection (Post-quiz 6)

### 1. Dockerfile Refinement (B1)
จาก Dockerfile เดิมของ `stats-service` ทีมปรับโครงสร้างให้ตรงกับ deliverable ของ Lab 6 โดยใช้ **multi-stage build** บน `python:3.12-slim` แยก stage ติดตั้ง dependency ออกจาก runtime image:

* **Layer separation:** stage `builder` สร้าง virtual environment ที่ `/opt/venv` ส่วน stage `runtime` คัดลอกเฉพาะ virtual environment และ `app.py` ที่จำเป็น
* **Security:** runtime ใช้ `USER nobody` แทน root และ `.dockerignore` กัน `.env`, Git metadata, tests, cache และไฟล์ IDE ออกจาก build context
* **Reproducibility:** root Dockerfile กำหนด base tag, working directory, port `8000` และคำสั่ง Uvicorn ไว้ชัดเจน
* **สิ่งที่ต้องยืนยันต่อ:** ต้อง build image จริงและบันทึกขนาดจาก `docker image ls` ก่อนสรุปว่าอยู่ต่ำกว่าเกณฑ์ 500 MB

---

### 2. Service Decomposition & Rule of Twos (B2)
ทีมเลือก `stats-service` เพราะขอบเขตปัจจุบันเป็น stateless API ขนาดเล็กที่มี responsibility ชัดเจน คือรายงานสถานะของ service และ health endpoint การ containerize จึงช่วยให้ทีมกำหนด runtime, port และ dependency ได้ซ้ำกันทุกเครื่อง

อย่างไรก็ตาม Rule of Twos ในเอกสารนี้เป็นเหตุผลของ boundary ที่ทีมกำลังเตรียมไว้ ไม่ใช่หลักฐานว่าระบบมี microservice หลายตัวหรือมี database แยกใช้งานจริงแล้ว

---

### 3. REST Endpoint Consistency
Container จะรันผ่าน Uvicorn ที่พอร์ต `8000` และ map ออกมาด้วย `-p 8000:8000` ให้ตรงกับ application contract:

* `GET /` ต้องตอบ `200` พร้อมข้อมูล `stats-service` และสถานะ `ok`
* `GET /health` ต้องตอบ `200` พร้อมสถานะ `healthy`
* ผล build/run, image size และ registry ยังต้องให้สมาชิกที่มี Docker และสิทธิ์ Registry ตรวจจริงก่อนแนบเป็นหลักฐานใน PR

---

## Lab 3 Reflection — Requirements Documents

### 1. Magic Shipping
การเขียน requirements ให้ดูครบจำนวนไฟล์ไม่เท่ากับการมี requirements ที่ใช้พัฒนาต่อได้จริง ถ้าเรารีบส่ง persona, scenario และ user story โดยไม่ตรวจ traceability ทีมอาจสร้าง feature ที่ไม่มีผู้ใช้หรือไม่ช่วยแก้ pain point ของต้นกับปุ๊ก ดังนั้นทีมต้องตรวจว่าแต่ละ story มีที่มาจาก scenario และมี acceptance criteria ที่ทดสอบได้

### 2. NFR ไม่ควรเป็นเพียงคำคุณศัพท์
คำว่า “เร็ว”, “ปลอดภัย” หรือ “ใช้งานง่าย” ยังไม่ช่วยให้ทีมตัดสินว่าผ่านหรือไม่ผ่าน เราจึงเปลี่ยนเป็น metric เช่น p95 response time, จำนวนผู้ใช้ที่ทำ task สำเร็จ, authorization test pass rate และ coverage ตัวเลขเหล่านี้ยังเป็น draft ที่ต้อง validate แต่ทำให้ทีมเห็นวิธีทดสอบและพูดคุย trade-off ได้ชัดขึ้น

### 3. User Story ที่ดีต้องบอกคุณค่าของผู้ใช้
การเขียน “ทำ dashboard” เป็น task มากกว่า user story เราจึงใช้รูปแบบ As a / I want / So that และผูกกับ persona, scenario, priority, estimate และ acceptance criteria ก่อนนำไปสร้าง Issue การแยก user value ออกจาก implementation ช่วยให้ทีมตัด feature ที่ไม่จำเป็นและรักษา scope ของ Sprint ได้

### สิ่งที่จะปรับใน Sprint ถัดไป
ทีมจะตรวจ requirements ด้วย traceability table ก่อนเริ่มเขียน production code และจะ validate ตัวเลข NFR กับ test data จริง เมื่อมี prototype หรือ service ที่รันได้แล้ว

