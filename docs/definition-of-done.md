# Definition of Done (DoD)
> มาตรฐานและข้อตกลงร่วมกันของทีมในการพิจารณาว่า Feature/Task เสร็จสมบูรณ์พร้อมส่งมอบ

---

ก่อนที่งานหรือ Pull Request (PR) แต่ละชิ้นจะถูกนับว่า **"Done"** และพร้อม Merge เข้าสู่ Branch หลัก จะต้องผ่านเกณฑ์ทั้งหมดดังต่อไปนี้:

### 1. Feature Implementation & Acceptance Criteria
- [ ] พัฒนาฟังก์ชันการทำงานตรงตาม Requirement และผ่าน Acceptance Criteria ที่ตกลงไว้ครบถ้วน
- [ ] ฟังก์ชันสามารถทำงานบน UI จริงได้โดยไม่มีข้อผิดพลาด (Manual Testing ผ่าน)

### 2. Code Quality & Standards
- [ ] โค้ดผ่านการตรวจสอบ Linting และ Formatting ตามมาตรฐานของโปรเจกต์ (ไม่มี Error/Warning ค้าง)
- [ ] ไม่ทิ้ง Dead code, โค้ดที่ Comment ค้างไว้ หรือ `console.log` ที่ใช้ในการดีบัก
- [ ] มีการกำหนด Data Types อย่างชัดเจนและรัดกุม (หลีกเลี่ยงการใช้ `any`)

### 3. Code Review & Approval
- [ ] ได้รับการ Review และ Approval จากสมาชิกในทีมอย่างน้อย 1 คนก่อน Merge

### 4. Git & Commit Hygiene
- [ ] Branch ได้รับการ Update ให้ตรงกับ Branch ล่าสุด และจัดการ Resolve Conflicts เรียบร้อยแล้ว

### 5. Documentation & Environment
- [ ] อัปเดต Documentation หรือ `README.md` หากมีการเพิ่มฟีเจอร์ใหม่, เปลี่ยนแปลง API หรือต้องติดตั้ง Dependency เพิ่มเติม
- [ ] โค้ดสามารถรัน (Build / Start) ผ่านได้สำเร็จในเครื่องอื่นโดยไม่เกิดปัญหาเรื่อง Environment