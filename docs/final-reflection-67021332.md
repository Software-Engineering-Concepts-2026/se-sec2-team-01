# Final Reflection — Grand Finale (Week 15)

* **ชื่อ-นามสกุล:** นายอดิศักดิ์ เกาะสังข์ (Adisak Kaosang)
* **รหัสนิสิต:** 67021332
* **บทบาทในทีม:** Full-Stack & Containerization Developer (Sec 2, Team 01: Need to rest)
* **โปรเจกต์:** [Good Night Web App](https://good-night-webapp.vercel.app/) · [Canva Slides](https://canva.link/zjhvupx38lecemd)

---

## 1. What did you build?

ผมร่วมพัฒนาเว็บแอปพลิเคชัน Good Night ([เว็บจริง](https://good-night-webapp.vercel.app/)) โดยรับผิดชอบงานหลักดังนี้:
1. **ระบบตั้งเป้าหมายการนอน (Sleep Goal Setup):** ทำหน้าตั้งชั่วโมงนอน (2–12 ชม.) และเวลาเข้านอน พร้อมระบบแนะนำชั่วโมงนอนตามอายุ โดยเริ่มจากสร้าง Prototype ใน [PR #47](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/pull/47)
2. **ทำ Docker ให้บริการสถิติ (Stats Service):** เขียน Multi-stage Dockerfile และสร้างอิมเมจ `adisakx2548/stats-service:v0.1.0` ใน [PR #44](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/pull/44)
3. **ปรับปรุงโค้ด (Refactoring):** ปรับชื่อฟังก์ชันและแยกการสร้าง payload ใน Stats Service ใน [PR #50](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/pull/50)

---

## 2. What problem did you solve?

- **ฝั่งผู้ใช้:** หลายคนไม่รู้ว่าวัยตัวเองควรนอนกี่ชั่วโมง ระบบจึงช่วยแนะนำช่วงเวลานอนตามเกณฑ์อายุทั่วไป และเปิดให้ตั้งเป้าหมายเพื่อนำไปคิดคะแนนการนอน (Sleep Score)
- **ฝั่งการทำงานในทีม:** บริการ Stats Service มีปัญหาเรื่องรันในเครื่องแต่ละคนแล้วได้ผลไม่เหมือนกัน จึงใช้ Docker จัดการ environment ให้เหมือนกันทุกเครื่อง

---

## 3. What technical decision are you proudest of?

1. **การใช้ Multi-stage Dockerfile ใน [PR #44](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/pull/44) (Commit `aeb17c5`):** แยก stage ที่ใช้ติดตั้งแพ็กเกจออกจาก stage ที่ใช้รันจริง ทำให้ขนาดของอิมเมจเล็กลง และรันด้วย user ธรรมดาที่ไม่ใช่ root เพื่อความปลอดภัย
2. **การปรับชื่อฟังก์ชันและแยกโค้ดใน [PR #50](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/pull/50) (Commit `2906fe4`):** เปลี่ยนชื่อฟังก์ชันจาก `root` และ `health` เป็น `service_info` และ `health_check` ตามหลัก Tip 74 พร้อมแยกฟังก์ชันสร้างข้อมูล payload ออกมา เพื่อให้อ่านเข้าใจง่ายและแก้ไขได้สะดวกขึ้น

---

## 4. What failure taught you the most?

1. **ปัญหา Merge Conflict ตอนรวมงาน (Commit `6afa8a4`):** ตอนเอา Prototype มารวมกันเกิดโค้ดชนกัน เพราะไม่ได้ตกลงขอบเขตการแก้ไขไฟล์กับเพื่อนล่วงหน้า สอนให้รู้ว่าก่อนเริ่มทำต้องแบ่งหน้าที่และแยกไฟล์กันให้ชัดเจน
2. **ปัญหาโค้ดเดิมอ่านยาก ([docs/refactoring-journal.md](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/blob/main/docs/refactoring-journal.md)):** ตอนแรกตั้งชื่อฟังก์ชันตาม URL path ทำให้พอโค้ดเริ่มยาวแล้วคนอื่นอ่านไม่เข้าใจ สอนว่าควรตั้งชื่อให้สื่อความหมายตั้งแต่ตอนเริ่มเขียน

---

## 5. What would you do differently?

ถ้าเริ่มทำโปรเจกต์ใหม่ มี 3 เรื่องที่จะทำเป็นขั้นตอนจริง:
1. **แยกโฟลเดอร์ตามฟีเจอร์ตั้งแต่วันแรก:** เช่น แยก `features/goal-setup` กับ `features/session` ชัดเจน เพื่อให้คนในทีมแตก branch ทำงานพร้อมกันได้โดยโค้ดไม่ชนกัน
2. **ตั้งค่า Docker Compose ตั้งแต่สัปดาห์แรก:** ให้รันทั้งหน้าเว็บและบริการสถิติได้พร้อมกันในคำสั่งเดียว เพื่อนในทีมจะได้ไม่ต้องเสียเวลามาเซ็ตระบบทีละตัว
3. **ตกลงรูปแบบ JSON ก่อนเริ่มเขียนโค้ด:** คุยกันให้จบก่อนว่าหน้าบ้านต้องการข้อมูลอะไรจากหลังบ้าน จะได้ไม่ต้องแก้โครงสร้างข้อมูลไปมาตอนรวมระบบ

---

## 6. How did you embody Tip 52 (Delight Users)?

- **ช่วยแนะนำเวลาตามอายุ:** มีปุ่ม *"ไม่รู้ว่าควรนอนกี่ชั่วโมง?"* ให้ใส่อายุแล้วระบบจะบอกช่วงเวลาที่เหมาะสมให้อัตโนมัติ ผู้ใช้จะได้ไม่ต้องไปเปิดหาข้อมูลเอง
- **ไม่แอบเก็บข้อมูลส่วนตัว (PDPA):** ข้อมูลอายุที่กรอกใช้แค่คำนวณบนหน้าจอแล้วจบ ไม่มีการบันทึกลงฐานข้อมูล เพื่อเคารพความเป็นส่วนตัวของผู้ใช้
- **ปรับเวลาง่าย:** มีปุ่ม `+` / `−` ปรับเวลาทีละ 15 นาที ใช้งานบนมือถือสะดวก ไม่ต้องพิมพ์ตัวเลขเอง (ลองใช้งานได้ที่ [หน้าเป้าหมาย Good Night](https://good-night-webapp.vercel.app/))

---

## 7. How did you embody Tip 53 (Sign Your Work)?

- **ตั้งชื่ออิมเมจของตัวเอง:** เผยแพร่อิมเมจ `adisakx2548/stats-service:v0.1.0` บน Docker Hub ใน [PR #48](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/pull/48)
- **ลงชื่อในเอกสารของทีม:** เขียนแนะนำตัวเองและข้อตกลงการทำงานใน [team/adisak.md](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/blob/main/team/adisak.md) ผ่าน [PR #40](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/pull/40)
- **เขียน commit message ให้ชัดเจน:** เขียนบอกเสมอว่า commit นี้เพิ่มฟีเจอร์ แก้ไข หรือปรับปรุงส่วนไหน เพื่อให้เพื่อนในทีมตามดูประวัติย้อนหลังได้ง่าย

---

## 8. What value did this experience add to your SE journey?

ประสบการณ์ 15 สัปดาห์ช่วยให้เห็นขั้นตอนการทำงานจริงตั้งแต่รับโจทย์ ออกแบบ ทำ prototype จนถึงการ deploy ระบบขึ้น Vercel และเชื่อมต่อฐานข้อมูล Supabase โดยมีสิ่งที่นำไปปรับใช้ต่อได้ทันที:
1. **การจัดการฐานข้อมูลและความปลอดภัย (Supabase & RLS):** ได้เรียนรู้การใช้ Supabase PostgreSQL และการตั้งค่า Row Level Security (RLS) เพื่อจำกัดสิทธิ์ให้ผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตัวเอง ในโปรเจกต์ถัดไปจะนำแนวคิด RLS มาใช้ตั้งแต่แรก เพื่อป้องกันปัญหาข้อมูลรั่วไหลในระดับฐานข้อมูล
2. **การ deploy ระบบขึ้น Production (Vercel):** เห็นประโยชน์ของการ deploy แบบ static บน Vercel ที่ผูกกับ Git branch โดยตรง ทำให้การอัปเดตระบบทำได้รวดเร็ว ตรวจสอบผลบน Production ได้ทันทีโดยไม่ต้องตั้งค่าเซิร์ฟเวอร์ที่ซับซ้อน
3. **การทำงานร่วมกับทีมและเครื่องมือ:** นำเรื่อง Definition of Done (DoD), การตกลงรูปแบบข้อมูลร่วมกัน และการใช้ Docker คุม environment ของบริการย่อยมาใช้ เพื่อลดปัญหาความไม่เข้ากันของระบบในการทำงานเป็นทีม
4. **ความรับผิดชอบต่อข้อมูลผู้ใช้ (PDPA):** เข้าใจการทำระบบให้สอดคล้องกับสิทธิของผู้ใช้จริง เช่น การทำฟังก์ชันลบบัญชีและข้อมูลทั้งหมด (`delete_my_account`) ตามคำขอของผู้ใช้ และการเก็บข้อมูลเท่าที่จำเป็น (Data Minimization)

