# Reflection

> เอกสารนี้เป็น reflection ระดับทีมของ Good Night โดยเพิ่มบันทึกตามลำดับ Lab เพื่อให้เห็นการเรียนรู้ต่อเนื่อง ส่วน Lab 1–2 ใช้เป็น team learning note เพิ่มเติม เพราะใบงานสองบทแรกไม่ได้กำหนด `reflect.md` แยกเป็น deliverable

## Lab 1 Reflection — First Pragmatic Commit

### 1. Pragmatic work ต้องเริ่มจากข้อตกลงที่ตรวจได้

การทำไฟล์แนะนำสมาชิกทำให้ทีมเห็นว่า “ทำงานแบบมืออาชีพ” ต้องแปลงเป็นพฤติกรรมที่ตรวจได้ เช่น ใช้ branch แยก เขียน conventional commit เปิด PR และขอ review ไม่ใช่เพียงคำสัญญากว้าง ๆ

### 2. Broken Window เกิดได้จากเรื่องเล็ก

ชื่อไฟล์ที่ไม่สม่ำเสมอ ข้อความที่ไม่ชัด หรือการ push ตรง `main` อาจดูเป็นปัญหาเล็ก แต่ทำให้ทีมตามงานและตรวจการเปลี่ยนแปลงยากขึ้น การแก้ตั้งแต่ต้นช่วยลดต้นทุนใน Lab ถัดไป

### 3. สิ่งที่จะทำต่อ

ทีมจะรักษา branch/PR workflow เดิม และเมื่อเจอ blocker จะรายงานพร้อมเสนอทางเลือกหรือผลกระทบ ไม่ปล่อยให้ปัญหาเล็กสะสมจนกลายเป็นหนี้งานเอกสาร

---

## Lab 2 Reflection — Sprint Zero Setup

### 1. Scope ต้องมีเหตุผลรองรับ

การเลือก Good Night ทำให้ทีมต้องแยกสิ่งที่จำเป็นต่อ core flow ออกจาก feature ที่อยากทำในอนาคต เราจึงกำหนด manual sleep log และ dashboard เป็น Must-have และเลื่อน real-time wearable sync ออกนอก scope เทอมนี้

### 2. Backlog และ DoD ช่วยลดความเข้าใจไม่ตรงกัน

การแตก feature เป็น Issue และเขียน Definition of Done ทำให้ทีมเห็นเกณฑ์ “เสร็จ” ชัดขึ้น ทั้งด้าน Acceptance Criteria, review, documentation และการรันงานบน environment อื่น ไม่ใช่แค่มีโค้ดแล้วจบ

### 3. ความเสี่ยงที่ต้อง validate

ความเสี่ยงสำคัญคือผู้ใช้อาจเบื่อการกรอกข้อมูลเองและข้อมูลความรู้สึกอาจคลาดเคลื่อน Prototype และ requirements ใน Lab ถัดไปจึงต้องช่วยตรวจว่า flow สั้นพอและข้อมูลที่เก็บมีประโยชน์ต่อการวิเคราะห์จริง

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

---

## Lab 4 Reflection — Rapid Prototyping

### 1. Prototype ช่วยตอบคำถามเรื่อง flow

การทำ prototype ทำให้ทีมเห็น interaction ของการกรอกพฤติกรรมก่อนนอน การกดบันทึก การดูประวัติ และการสลับไปหน้า analysis ได้เร็วกว่าการอธิบายด้วยเอกสารอย่างเดียว จึงช่วยตรวจความเข้าใจของ user story ก่อนลงทุนทำ backend

### 2. State change สำคัญกว่าหน้าตาเพียงอย่างเดียว

Prototype ที่มี form, tab และผลลัพธ์หลัง submit ทำให้ทีมต้องคิดต่อว่าแต่ละ action เปลี่ยน state อย่างไร และ feedback ที่ผู้ใช้เห็นคืออะไร บทเรียนนี้ช่วยให้การออกแบบครั้งต่อไปเริ่มจาก user flow และ acceptance criteria ไม่ใช่เริ่มจากสีหรือ layout อย่างเดียว

### 3. ขอบเขตที่ยังไม่ได้ทำ

Prototype ยังไม่มี persistence, authentication, database หรือการ sync wearable ดังนั้นยังไม่ควรเรียกว่า production implementation ขั้นถัดไปคือตรวจ flow กับผู้ใช้และเชื่อมต่อกับ requirements/NFR ที่มีอยู่

---

## Lab 5 Reflection — Architectural Artifacts

### 1. ADR: เหตุผลต้องมาก่อนรายการ technology

การเขียน ADR ทำให้ทีมเห็นว่า tech stack ไม่ใช่รายการ library ที่เลือกตามความคุ้นเคย แต่เป็นคำตอบต่อ context ของ Good Night เช่น ทีมขนาดเล็กต้อง demo end-to-end, core scope ยังเป็น manual sleep log และต้องรักษาความถูกต้องของข้อมูลสุขภาพ เราจึงเลือก modular monolith สำหรับ core API และวาง Insight Service เป็น boundary ที่แยกได้ในอนาคต แทนการเริ่มด้วย full microservices ที่มี operational overhead สูงเกินความจำเป็นตอนนี้

### 2. C4: แยกมุมมอง system context กับ container

System Context ช่วยให้ทีมเห็นผู้ใช้ ต้นกับปุ๊ก และ external systems โดยไม่หลุดไปคุยเรื่อง implementation เร็วเกินไป ส่วน Container Diagram ช่วยระบุ responsibility ของ Web App, Backend API, Insight Service และ Sleep Database พร้อม protocol ระหว่างกัน การแยกสองระดับนี้ทำให้เห็นชัดว่า Web App ไม่ควรอ่าน database โดยตรง และทุกข้อมูลสุขภาพต้องผ่าน authorization boundary ของ API

### 3. Tech Stack: trade-off ต้องตรวจสอบต่อได้

เหตุผลของ PostgreSQL, Flask, React + Vite และ Docker Compose เชื่อมกับ NFR เรื่อง data integrity, response time, deploy ซ้ำได้ และการพัฒนา dashboard ไม่ใช่แค่คำว่า “ทีมถนัด” ขณะเดียวกันเราบันทึก trade-off ไว้ด้วย เช่น Flask ต้องกำหนด project structure เอง, PostgreSQL setup หนักกว่า SQLite และ OpenAI API เป็น optional adapter ไม่ใช่ dependency ของทุก acceptance criteria

### สิ่งที่จะปรับใน Sprint ถัดไป

ทีมจะ render Mermaid ใน PR preview และ cross-review ว่าชื่อ component, edge label, API boundary และ tech stack ตรงกับ implementation จริง ก่อนเริ่มแยก service หรือเพิ่ม external integration

---

## Lab 6 Reflection — First Container

### 1. Dockerfile ต้องรายงานตามสิ่งที่ build จริง

`stats-service` ใช้ `python:3.12-slim`, กำหนด `WORKDIR`, copy dependencies และ application, เปิด port `8000` และรันด้วย `USER nobody` เพื่อลดสิทธิ์ของ process ภายใน container โดยทีมทำ multi-stage build สำเร็จแล้ว (แยก builder stage และ runtime stage) ทำให้ Image มีขนาดกะทัดรัดเพียง 55.2 MB (Disk usage 228 MB) รันด้วย non-root user และผ่านเกณฑ์ประเมินขนาด < 500 MB เรียบร้อยแล้ว ทั้งนี้ Dockerfile ที่ root ของ repository ถูกกำหนดเป็น entry point หลักตรงตามที่ระบุใน README

### 2. Service boundary ต้องไม่เกิน implementation

การเลือก `stats-service` ทำให้ทีมเห็นประโยชน์ของ service ที่แยก deploy ได้ แต่ implementation ปัจจุบันยังเป็น service skeleton ที่มี endpoint ข้อมูล service และ health check ไม่ใช่ระบบวิเคราะห์สถิติที่เสร็จสมบูรณ์ เราจึงไม่ควรอ้างว่ามี data boundary หรือ scalability ที่ยังไม่ได้สร้างและทดสอบ

### 3. REST และสิ่งที่จะตรวจต่อ

แอปรันผ่าน Uvicorn ที่ port `8000` และ endpoint `/` กับ `/health` คืน JSON status ได้ การตรวจต่อควรครอบคลุมการ build/run image จริง, response 2xx จาก container, image registry และความสอดคล้องระหว่าง README, Dockerfile และคำสั่งรัน

---

## Lab 7 Reflection — Refactoring Milestone 1

### 1. Naming เป็น code quality ที่เห็นผลเร็ว
ทีมพบว่า handler ชื่อ `root` และ `health` ยังสื่อความหมายของบทบาทไม่ชัด จึงเพิ่ม contract tests ก่อน refactor แล้วเปลี่ยนเป็น `service_info` และ `health_check` พร้อมแยก constants และ payload builders โดยคง response contract เดิม

### 2. Tests ช่วยให้ refactor มีขอบเขต
การมี tests สำหรับ `/` และ `/health` ก่อนแก้ช่วยยืนยันว่า refactor ไม่ได้เปลี่ยน behavior โดยไม่ตั้งใจ หลังแก้ทีมรัน test suite ใน environment local และได้ผลผ่าน 2 tests ทำให้การเปลี่ยนชื่อและจัด responsibility มีหลักฐานรองรับ

### 3. บทเรียนจาก AI workflow
AI ช่วยอธิบาย smell และเสนอชื่อ/กรณีทดสอบ แต่ทีมเป็นผู้เลือกขอบเขตและตรวจ diff เอง ขั้นถัดไปคือบันทึก Before/After ใน refactoring journal, เปิด PR และให้ reviewer ตรวจว่า refactor ไม่ปะปนกับ feature ใหม่

### 4. DRY Hunt (Don't Repeat Yourself)
ทีมได้สำรวจความซ้ำซ้อนในโค้ด (DRY Hunt) และพบการฮาร์ดโค้ดค่า String เช่น `"stats-service"` และ Version `"0.1.0"` ซ้ำกันหลายจุดระหว่างการกำหนด Metadata ของ FastAPI app กับการส่งคืนใน Response Payload จึงได้สกัดออกมาเป็น Module Constants:
* `SERVICE_NAME: Final[str] = "stats-service"`
* `SERVICE_VERSION: Final[str] = "0.1.0"`
การปรับปรุงนี้ช่วยให้มี Single Source of Truth หากมีการอัปเดตเวอร์ชันหรือชื่อ Service ในอนาคต จะแก้เพียงจุดเดียว ลดโอกาสเกิดข้อผิดพลาดและความไม่สอดคล้อง

### 5. Orthogonality Check
ทีมได้ประเมินความเป็นอิสระต่อกัน (Orthogonality) ระหว่างส่วนประกอบต่างๆ:
* **ก่อนปรับปรุง:** Logic การสร้าง JSON payload ผูกติดอยู่ภายใน Route Handler โดยตรง ทำให้ Transport Layer (FastAPI routing) และ Data Layer (Payload structure) มี Coupling ต่อกัน การเปลี่ยนแปลงรูปแบบการส่งข้อมูลกระทบต่อทั้งสองส่วน
* **หลังปรับปรุง:** การแยกฟังก์ชัน `get_service_info_payload()` และ `get_health_payload()` ออกมาเป็นฟังก์ชันอิสระ ทำให้โค้ดมีความเป็น Orthogonal สูงขึ้น กล่าวคือ หากต้องการนำ payload ไปใช้ใน Background task, CLI หรือต้องการ Unit test โครงสร้างข้อมูล จะสามารถทำได้ทันทีโดยไม่ต้องจำลอง HTTP Request เข้ามา และการแก้ Routing path หรือ Decorator จะไม่กระทบต่อ logic การสร้างข้อมูล

### 6. Refactoring Plan สำหรับ Sprint ถัดไป
เมื่อ Service เริ่มมี Logic การประมวลผลข้อมูลสถิติสุขภาพจริงใน Sprint 2 ทีมวางแผน Refactoring ต่อยอดดังนี้:
1. **Schema Validation ด้วย Pydantic:** แปลง Response Payload จาก Dictionary ธรรมดาไปเป็น Pydantic BaseModel (เช่น `ServiceInfoResponse`, `HealthResponse`) เพื่อรองรับ Type Validation และ OpenAPI Documentation อัตโนมัติ
2. **Service Layer Separation:** เมื่อมี endpoint คำนวณค่าเฉลี่ยเวลานอนและวิเคราะห์ Sleep Goal จะแยกเป็น `StatsCalculatorService` คลาสเฉพาะ เพื่อไม่ให้ Route Handlers บวม (Fat Controllers)
3. **Error Handling & Middleware:** ออกแบบ Exception Handlers กลางสำหรับส่งคืน Error format ที่เป็นมาตรฐานเดียวกันทั้งระบบ
