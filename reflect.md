# Reflection

## Lab 6 Reflection (Post-quiz 6)

### 1. Dockerfile Refinement (B1)
จากการดราฟต์ Dockerfile ในคาบบรรยาย เราได้นำมาปรับปรุงเป็น Production-grade Dockerfile โดยใช้เทคนิค **Multi-stage build** บน Base image `python:3.11-slim`:
* **Layer Caching & Optimization:** แยกขั้นตอนการติดตั้ง Dependencies (Stage `builder`) ออกจาก Runtime Environment (Stage `runner`) ทำให้ Image มีขนาดกะทัดรัด (ไม่เกินเกณฑ์ 500 MB) และลดเวลาในการ Build
* **Security & Non-root User:** เปลี่ยนจากการรันด้วย `root` ไปใช้ `USER appuser` เพื่อลด Attack Surface และปิดช่องโหว่ด้านความปลอดภัยตามแนวคิด Least Privilege (ESP §7)
* **Configuration:** ไม่คัดลอกไฟล์ `.env` เข้าไปใน Image เพื่อป้องกัน Secret Leakage โดยส่งค่าผ่าน Environment Variables (`-e`) ขณะสั่ง `docker run` แทน

---

### 2. Service Decomposition & Rule of Twos (B2)
ทีมของเราเลือกนำ **`stats-service`** มาทำ Containerize ซึ่งผ่านการตรวจสอบตามเกณฑ์ **Microservices Rule of Twos** (ESP §6):
* **Data Boundary:** Service นี้จัดการข้อมูลสถิติและการประมวลผลเฉพาะด้านอย่างเป็นเอกเทศ ไม่แชร์ Database ตรงกับ Service อื่น
* **Independent Scalability:** เนื่องจากเป็น Stateless Service การแยกเป็น Container ทำให้ทีมสามารถ Deploy, Scale เพื่อรองรับภาระงานเฉพาะส่วน หรือ Rollback ได้อย่างอิสระโดยไม่กระทบต่อ Core Service อื่นๆ ของระบบ

---

### 3. REST Endpoint Consistency
Endpoint ภายใน Container ถูกรันผ่าน Uvicorn Web Server ที่พอร์ต `8000` โดยมีการทำ Port Mapping ออกมาให้เข้าถึงได้ผ่าน Localhost อย่างถูกต้อง:
* Service ส่งผลลัพธ์สถานะเป็น **HTTP 2xx (200 OK)** เมื่อระบบพร้อมทำงาน
* โครงสร้างของ Containerized Service นี้ถูกออกแบบให้เป็นไปตามมาตรฐาน RESTful API พร้อมที่จะเชื่อมต่อผ่าน API Gateway หรือนำไปทำ Orchestration ร่วมกับ Service อื่นๆ ในระบบ Cloud ต่อไป

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

