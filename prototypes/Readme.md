# Sprint 1 Prototype: Sleep Goal Setup & Quality Overview (Good Night)

## 1. Feature Name & User Story Reference
* **Feature:** ระบบตั้งเป้าหมายและบันทึกพฤติกรรมการนอนเบื้องต้น (Sleep Goal & Activity Logger)
* **User Story (Must Priority):** 
  > *“ในฐานะผู้ใช้งานที่ต้องการปรับปรุงสุขอนามัยการนอน ฉันต้องการเลือกอายุ กำหนดเวลานอน และระบุกิจกรรมก่อนนอน เพื่อให้ระบบบันทึกข้อมูลและนำไปประเมินแนวทางการพักผ่อนที่เหมาะสมได้”*

---

## 2. Approach: Prototype vs Tracer Bullet
* **ประเภทที่เลือก:** **Prototype (แบบทิ้งได้/เรียนรู้)**
* **เหตุผล:** 
  ทีมต้องการทดสอบ **UI Flow** และความง่ายในการกรอกข้อมูลของผู้ใช้ (User Experience) ว่าการเลือกกิจกรรมก่อนนอนแบบ Checklist ร่วมกับการเลือกเวลานอน มีความชัดเจนและตอบสนองความต้องการของผู้ใช้หรือไม่ ก่อนที่จะออกแบบโครงสร้างฐานข้อมูล (Database Schema) และเชื่อมต่อ API จริงใน Sprint ถัดไป

---

## 3. สิ่งที่ทำได้ (Scope & Capabilities)
1. **Interactive Form:** เลือกช่วงอายุ, ระบุเวลาเข้านอนที่ต้องการ, และเลือกพฤติกรรม/ปัจจัยก่อนนอน (เช่น คาเฟอีน, ใช้หน้าจอ, ออกกำลังกาย)
2. **State Persistence:** จัดเก็บข้อมูลลงใน `localStorage` ของเบราว์เซอร์ เพื่อจำลองการส่งข้อมูลข้ามหน้า
3. **Dynamic Dashboard Calculation:** หน้า Dashboard คำนวณคะแนนคุณภาพการนอน (Sleep Score) ตามช่วงอายุและปัจจัยที่กระทบ พร้อมทั้งแสดงกราฟประวัติ 7 วันแบบ Interactive

---

## 4. สิ่งที่ไม่ได้ทำโดยเจตนา (Deliberately Out of Scope)
* **Backend & Real Database:** ยังไม่มีการเชื่อมต่อฐานข้อมูลจริง (ใช้ `localStorage` และชุดข้อมูลจำลอง)
* **Authentication & Security:** ไม่มีการทำระบบ Login/Register หรือเข้ารหัสข้อมูลผู้ใช้
* **Cross-device Responsive Optimization:** ออกแบบสำหรับ Desktop/Tablet Viewport เป็นหลัก ยังไม่ได้ปรับแต่ง Media Queries สำหรับหน้าจอมือถือขนาดเล็กทุกรุ่น

---

## 5. Next Steps (Sprint 2)
* พัฒนา API Backend สำหรับบันทึกข้อมูลแบบ Multi-user
* เพิ่มระบบการวิเคราะห์และแจ้งเตือนเวลานอนล่วงหน้า
* เชื่อมโยง Flow ระหว่างหน้าบันทึกข้อมูลเข้าสู่หน้าสรุปผลอย่างสมบูรณ์