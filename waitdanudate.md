# AI Usage & Reflection Report (Lab 6: First Container)

> **คำชี้แจงสำหรับผู้ตรวจ/เพื่อนร่วมทีม:** 
> เอกสารฉบับนี้รวบรวมข้อมูล 2 ส่วนหลักสำหรับส่งประเมินใน Lab 6 ได้แก่:
> 1. **Part 1:** การเปิดเผยการใช้งาน AI ตามนโยบายความโปร่งใส (AI Usage Disclosure)
> 2. **Part 2:** การสะท้อนผลการเรียนรู้จาก Post-quiz 6 (Reflection & Engineering Decisions)

---

## Part 1: AI Usage Disclosure

### 1. Tools Used
* **AI Tool:** Google Gemini

### 2. Prompts Used
รายการ Prompt สำคัญที่ใช้ในการแก้ปัญหาและพัฒนา Container:
* **Prompt 1:** *"ขอเทมเพลต Dockerfile แบบ Multi-stage build สำหรับ Python FastAPI ที่ใช้ base image alpine/slim, กำหนด USER non-root, EXPOSE port และมีไฟล์ .dockerignore ตามเกณฑ์ Lab 6"*
* **Prompt 2:** *"docker build -t <dockerhub-Adisakx2548>/<repo>-api:v0.1.0 ทำไมใช้คำสั่งนี้ไม่ได้ ช่วยแก้ Error invalid reference format"*
* **Prompt 3:** *"Uvicorn running on http://0.0.0.0:8000 แต่ตอนสั่ง docker run ใช้ -p 3000:3000 แล้วยิงไม่เข้า ต้องปรับแก้ port mapping อย่างไร"*
* **Prompt 4:** *"ช่วยสรุปการวิเคราะห์เปรียบเทียบข้อดี-ข้อเสีย (Trade-off) ระหว่าง Container กับ Virtual Machine (VM) ตามแนวคิด ESP §5.4 สำหรับใส่ใน docker/README.md"*

### 3. Direct AI Outputs Accepted
ส่วนที่นำผลลัพธ์จาก AI มาประยุกต์ใช้งานจริงในระบบ:
1. **Dockerfile:** โครงสร้าง Multi-stage build สำหรับ Python FastAPI (แยก Stage `builder` และ `runner`) พร้อมการสร้างและสลับไปใช้ `USER appuser` เพื่อความปลอดภัย
2. **.dockerignore:** ชุดรายการไฟล์/โฟลเดอร์ที่ไม่จำเป็นต้องคัดลอกลง Image (เช่น `__pycache__`, `.env`, `.git`) เพื่อลดขนาด Image ให้ต่ำกว่า 500 MB
3. **docker/README.md:** โครงสร้างเอกสารและเนื้อหาการวิเคราะห์ Container vs VM ตามทฤษฎีบทที่ 5
4. **Command & Port Troubleshooting:** การแก้ไขข้อผิดพลาดของคำสั่ง `docker build` (การลบ `< >`, ใช้ตัวพิมพ์เล็กทั้งหมด, ใส่ `.` ปิดท้าย) และการแก้ไข Port Mapping เป็น `-p 8000:8000` ให้ตรงกับ Uvicorn

---

## Part 2: Reflection (Post-quiz 6)

### 1. Dockerfile Refinement (B1)
จากการดราฟต์ Dockerfile ในคาบบรรยาย เราได้นำมาปรับปรุงเป็น Production-grade Dockerfile สำหรับ `stats-service` (Python/FastAPI):
* **Multi-stage Build & Layer Optimization:** แยกขั้นตอนการติดตั้ง Dependencies (Stage `builder`) ออกจาก Runtime Environment (Stage `runner`) ส่งผลให้ขนาด Final Image มีขนาดเล็กเพียง ~150 MB (ผ่านเกณฑ์ประเมิน < 500 MB)
* **Security & Non-root User:** เปลี่ยนจากการรันด้วย `root` ไปใช้ `USER appuser` เพื่อลด Attack Surface ตามหลัก Least Privilege (ESP §7)
* **Secret Protection:** ไม่คัดลอกไฟล์ `.env` เข้าไปใน Image โดยใช้การส่ง Environment Variables (`-e`) ในขณะสั่ง `docker run` แทนเพื่อป้องกัน Secret Leakage

### 2. Service Decomposition & Rule of Twos (B2)
ทีมได้เลือกนำ **`stats-service`** มาทำ Containerize ซึ่งผ่านเกณฑ์ **Microservices Rule of Twos** (ESP §6):
* **Data Boundary:** จัดการข้อมูลสถิติและการประมวลผลอย่างเป็นเอกเทศ ไม่ได้แชร์ Database ตรงกับ Service อื่น
* **Independent Scalability:** เนื่องจากเป็น Stateless Service การแยกเป็น Container ช่วยให้สามารถ Deploy, Scale รับโหลดเฉพาะส่วน หรือ Rollback ได้อย่างอิสระโดยไม่กระทบต่อ Core Service ของระบบ

### 3. REST Endpoint Consistency
Endpoint ภายใน Container ถูกรันผ่าน Uvicorn Web Server ที่พอร์ต `8000` และทำ Port Mapping ออกมาให้เข้าถึงได้ผ่าน Localhost อย่างถูกต้อง:
* Service ส่งผลลัพธ์สถานะเป็น **HTTP 2xx (200 OK)** เมื่อระบบพร้อมทำงาน
* โครงสร้างของ Service นี้พร้อมที่จะเชื่อมต่อผ่าน API Gateway หรือนำไปทำ Container Orchestration ร่วมกับระบบ Cloud ต่อไป