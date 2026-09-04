# Sprint Retrospective: Milestone 1

เอกสารฉบับนี้บันทึกผลการทบทวนการทำงานย้อนหลัง (Sprint Retrospective) ของทีม Good Night สำหรับ **Sprint 0 (Project Inception & Architecture)** และ **Sprint 1 (Prototyping & First Container)** เพื่อเป็นหลักฐานความพร้อมและการปรับปรุงกระบวนการทำงานสำหรับ Milestone 1

---

## Sprint 0 Retrospective (Inception, Requirements & Architecture)
* **ช่วงเวลา:** สัปดาห์ที่ 1 – 3 (Lab 1 – 5)
* **เป้าหมายหลัก:** กำหนดแนวคิดระบบ Good Night, จัดทำ Personas, Requirements (SRS/Scenarios/Stories), C4 Architecture และ ADR

### 1. What Went Well (สิ่งที่ทำได้ดี)
- **การจัดทำ Personas และ Scenarios ชัดเจน:** Persona ของ "ต้น" (Health-Optimizing) และ "ปุ๊ก" (Sleep-Challenged) ช่วยให้ทีมเห็น User Pain Points ที่แท้จริง และนำไปสู่ User Stories ที่มี Acceptance Criteria ชัดเจน
- **การเลือกสถาปัตยกรรมแบบ Pragmatic:** ทีมเลือก Modular Monolith สำหรับ Core Backend พร้อมวาง Boundary ของ Insight Service แยกต่างหาก ช่วยลด Operational Overhead ในช่วงต้นโปรเจกต์
- **Git & PR Workflow:** ทีมเริ่มใช้ Feature Branch และ Pull Request review กันอย่างจริงจัง

### 2. What Could Be Improved (สิ่งที่ควรปรับปรุง)
- **การสื่อสารเรื่อง Scope:** ในช่วงแรกทีมมีการตั้ง Assumption เรื่องการเชื่อมต่อ Wearable Devices แบบ Real-time ซึ่งเกินกำลังของทีมในระยะสั้น
- **การ Render Mermaid:** พบปัญหาบาง diagram ไม่ render ใน PR preview ทำให้ต้องแก้ format ซ้ำ

### 3. Action Items (สิ่งที่นำไปปฏิบัติใน Sprint 1)
- [x] ตัด Scope ที่เป็น Non-essential ออก โดยระบุ Wearable Sync เป็น Won't have ใน MoSCoW
- [x] ทำ Cross-review Mermaid Syntax ก่อนเปิด PR เสมอ

---

## Sprint 1 Retrospective (Prototyping, Containerization & Refactoring)
* **ช่วงเวลา:** สัปดาห์ที่ 4 – 5 (Lab 6 – 7)
* **เป้าหมายหลัก:** พัฒนา Interactive Prototypes, สร้าง Production-grade Docker Image (`stats-service`), Refactoring Code และเตรียมความพร้อม Milestone 1

### 1. What Went Well (สิ่งที่ทำได้ดี)
- **Interactive Prototype ทดสอบ User Flow ได้จริง:** ทั้ง Sleep Goal Setup, Health Tracking, และ Dashboard ช่วยให้เห็น Interaction ก่อนเริ่มต่อ Backend ใน Sprint 2
- **Multi-stage Docker Build ประสบความสำเร็จ:** Image `adisakx2548/stats-service:v0.1.0` มีขนาดเพียง 55.2 MB (Disk usage 228 MB) ต่ำกว่าเกณฑ์ 500 MB มาก และรันด้วย Non-root user (`nobody`) พร้อม Publish ขึ้น Docker Hub สำเร็จ
- **Refactoring ควบคู่กับ Contract Tests:** การมี Contract Tests รองรับก่อน Refactor ฟังก์ชันเป็น Role-focused (`service_info`, `health_check`) ทำให้มั่นใจได้ว่าไม่มี Regression เกิดขึ้น (รันผ่าน `2 passed`)

### 2. What Could Be Improved (สิ่งที่ควรปรับปรุง)
- **Branch Synchronization:** สมาชิกทีมมีการสลับทำงานหลาย Branch พร้อมกัน ทำให้เกิด Merge Conflict และไฟล์บางส่วนค้างใน Working Tree ซึ่งต้องอาศัยการ Fetch/Merge อย่างระมัดระวัง
- **การติดตั้ง Dependencies ใน Local:** สมาชิกบางคนยังไม่มี `pytest` ในเครื่อง ทำให้รัน test ไม่ผ่านในครั้งแรก ต้องจัดทำ `requirements-dev.txt` ให้ชัดเจน

### 3. Action Items (สำหรับเตรียมส่ง Milestone 1 และก้าวสู่ Sprint 2)
- [x] Merge โค้ดหลักจาก `origin/main` เข้า feature branch สม่ำเสมอเพื่อลดความขัดแย้งของไฟล์
- [x] สร้าง `requirements-dev.txt` เพื่อให้การ setup สภาพแวดล้อมการทดสอบทำได้ด้วยคำสั่งเดียว
- [ ] สร้าง Release Tag `v0.1.0` และบันทึก Release Notes สรุปผลงาน Milestone 1 บน GitHub (มีกำหนดการทำทันทีหลัง merge PR นี้เข้า main)
- [ ] นำ Prototypes ที่ผ่านการประเมิน ไปเริ่มพัฒนา Production Frontend (React + Vite) ใน Sprint 2
