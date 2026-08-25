# Non-functional Requirements — Good Night

NFR ชุดนี้เป็น draft requirement สำหรับ Milestone แรก ต้องนำไป validate กับทีมและทดสอบใน environment จริงก่อนประกาศเป็นเกณฑ์ production

| ID | ประเภท | Requirement ที่วัดผลได้ | วิธีตรวจสอบ |
| --- | --- | --- | --- |
| NFR-01 | Performance | Dashboard ต้องตอบกลับภายใน **ไม่เกิน 2 วินาทีที่ p95** เมื่อมีข้อมูลของผู้ใช้ไม่เกิน 100 records | Load test ด้วย dataset 100 records และวัด p95 latency |
| NFR-02 | Performance | การคำนวณ weekly insight สำหรับข้อมูลไม่เกิน 30 คืนต้องเสร็จภายใน **5 วินาทีที่ p95** | Integration test พร้อมจับเวลา calculation |
| NFR-03 | Security | รหัสผ่านต้องมีความยาวอย่างน้อย **8 ตัวอักษร**, ข้อมูลรหัสผ่านที่จัดเก็บ **100%** ต้องผ่าน Argon2id หรือ bcrypt และต้องพบ password plain text ใน database หรือ log เท่ากับ **0 รายการ** | ตรวจ password policy, configuration, database fixture และ log scan |
| NFR-04 | Security / Privacy | ผู้ใช้ต้องอ่านหรือแก้ไข sleep record ของบัญชีอื่นไม่ได้ **100% ของ authorization test cases** | ทดสอบ valid/invalid user IDs และตรวจ HTTP response |
| NFR-05 | Privacy | ระบบต้องแจ้งวัตถุประสงค์การใช้ข้อมูลก่อนบันทึก health data และผู้ใช้ต้องถอน consent ได้ภายใน **3 ขั้นตอนหรือน้อยกว่า** | Usability test และตรวจ audit trail ของ consent |
| NFR-06 | Usability | ผู้ใช้ใหม่อย่างน้อย **4 จาก 5 คน** ต้องตั้ง baseline และบันทึก sleep record แรกสำเร็จภายใน **3 นาที** โดยไม่ต้องมีผู้ช่วย | Moderated usability test ตาม task script |
| NFR-07 | Usability / Accessibility | ฟอร์มหลัก **100% ของฟอร์มที่อยู่ใน scope** ต้องใช้งานด้วย keyboard ได้ครบ และ **100% ของ validation errors** ต้องเชื่อมกับ field ที่ผิดใน accessibility test | Keyboard test และ automated/manual accessibility review |
| NFR-08 | Availability | ในช่วงเวลาทดลองใช้งาน 08:00–22:00 ระบบต้องมี availability อย่างน้อย **99% ต่อเดือน** ไม่นับ planned maintenance | Monitoring และรายงาน uptime รายเดือน |
| NFR-09 | Maintainability | Core business logic ต้องมี automated test coverage อย่างน้อย **70%** และทุก PR ต้องผ่าน test suite ก่อน merge | Coverage report และ branch protection/CI check |
| NFR-10 | Data integrity | การบันทึก session เดิมซ้ำจากการกดปุ่มซ้ำต้องไม่สร้าง duplicate record เกิน **1 รายการต่อ session** และ timestamp ต้องเก็บ timezone ชัดเจน | Integration test, duplicate submission test และ database inspection |

## ขอบเขตและสมมติฐาน

- ตัวเลขเป็นเป้าหมายเริ่มต้นของทีม ไม่ใช่ผลทดสอบที่ทำเสร็จแล้ว
- NFR ด้าน uptime จะใช้เมื่อมี deployment environment ที่ monitor ได้จริง
- ระบบต้องไม่ใช้ NFR เป็นข้ออ้างให้ scope บานปลายเกิน Must-have ของ Project Proposal

## Traceability กับ User Stories

- **NFR-01, NFR-08:** US-08 — dashboard และ weekly trend ต้องตอบสนองได้และพร้อมใช้งานในช่วงทดลอง
- **NFR-02:** US-09, US-10 — analysis และ recommendation ต้องคำนวณได้ภายในเวลาที่กำหนด
- **NFR-03, NFR-04:** US-02, US-03 — สมัคร/เข้าสู่ระบบและการแยกข้อมูลระหว่างบัญชี
- **NFR-05:** US-01, US-10 — privacy notice, consent และการควบคุม notification
- **NFR-06, NFR-07:** US-01, US-05, US-06 — onboarding และการบันทึกข้อมูลต้องทำได้ง่ายและเข้าถึงได้
- **NFR-09:** US-01 ถึง US-10 — โค้ด business logic ของทุก story ต้องมี test และผ่าน CI ก่อน merge
- **NFR-10:** US-04, US-05, US-07 — session, sleep record และ activity tag ต้องไม่เกิดข้อมูลซ้ำหรือ timestamp กำกวม
