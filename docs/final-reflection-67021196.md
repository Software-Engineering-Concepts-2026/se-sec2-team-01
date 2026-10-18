# Final Reflection — รุ่งระวี แก้วงาม (67021196)

ทีม Need to rest · โปรเจกต์ Good Night

## 1. What did you build?

ทีมทำเว็บ Good Night สำหรับบันทึกและดูสถิติการนอน กดจับเวลาตอนเข้านอน/ตื่น หรือกรอกเวลาเองก็ได้ แล้วระบบจะคำนวณเวลาหลับจริง ประสิทธิภาพการนอน มีกราฟ และแนะนำเวลาเข้านอนให้ ส่วนของฉันคือ project proposal, Definition of Done, personas, dashboard prototype, unit test ของ `calculate_discount`, เอกสาร Safety Net และปรับหน้าเว็บกับ README ช่วงท้าย

หลักฐาน: PR #39, #51, #58 · commit [`b57860c`](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/commit/b57860c5a8ab3553656da278a8f8c9a462999150), [`2dfd927`](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/commit/2dfd927fca4b767ddf00c936a41faafa26676c5b) · เว็บ https://good-night-webapp.vercel.app/

## 2. What problem did you solve?

คนจำนวนมากรู้ว่าตัวเองนอนไม่ดี แต่ไม่รู้ว่าเพราะอะไร เว็บนี้ช่วยให้เห็นตัวเลขและความสัมพันธ์ เช่น คืนที่ดื่มกาแฟตื่นมาสดชื่นน้อยกว่า ส่วนในทีม ปัญหาคือไม่มั่นใจว่าโค้ดที่ merge จะไปทำของเดิมพังหรือเปล่า เลยทำ test กับ CI ไว้กันไว้ก่อน

## 3. What technical decision are you proudest of?

ตอนลองกรอกว่านอนแค่ 1 ชั่วโมง เว็บขึ้นประสิทธิภาพ 92% สีเขียว ตามสูตรถือว่าถูก แต่คนดูแล้วจะเข้าใจว่านอนดี ฉันเลยไม่แก้สูตร แต่ให้คืนที่นอนน้อยมากแสดงเป็นสีเตือนพร้อมป้าย "นอนน้อยมาก" แทน ตัวเลขยังถูกต้อง แต่ผู้ใช้ไม่เข้าใจผิด

## 4. What failure taught you the most?

ทำ commit ชื่อ "resolve all conflicts" ([`739a233`](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/commit/739a2334237261ecd0e8a9c69f3a9e1099892ce3)) แต่จริง ๆ ยังเหลือเครื่องหมาย conflict ค้างอยู่ใน `.gitignore` เพราะไม่ได้เปิดเช็กทุกไฟล์ CI ก็ไม่จับ เพราะไม่มี test ตรวจไฟล์นี้ อีกครั้งคือ CI แดงทั้งหมด ตอนแรกคิดว่าโค้ดพัง แต่พอเปิดดูจริง ๆ เป็นเพราะ organization ติดเรื่อง billing ของ GitHub บทเรียนคือ CI เขียวไม่ได้แปลว่าทุกอย่างถูก และ CI แดงก็ไม่ได้แปลว่าโค้ดผิดเสมอ ต้องเปิดดูก่อนสรุป

## 5. What would you do differently?

- ก่อน commit หลังแก้ conflict จะรัน `git diff --check` ทุกครั้ง
- รัน `ruff check` และ `pytest` ในเครื่องให้ผ่านก่อน push จะได้ไม่ต้องแก้ทีละ commit
- เขียน commit message ให้ตรงรูปแบบทุกครั้ง (เคยเขียนแค่ `fix raedme`)
- ถ้าต้องตั้งตัวเลขหรือเกณฑ์ที่กระทบผู้ใช้ จะคุยกับทีมแล้วจดเหตุผลไว้ก่อน

## 6. How did you embody Tip 52 (Delight Users)?

พยายามทำให้ใช้ง่ายและไม่ต้องเดา เช่น เพิ่มโหมดจับเวลาที่กดแค่สองครั้งต่อคืน ตัดปุ่มที่ซ้ำกันในหน้าหลัก รวมหน้าตั้งค่าเหลือคอลัมน์เดียว ปุ่มสมัครกดไม่ได้จนกว่าจะกรอกครบ และถ้าข้อมูลยังไม่พอให้วิเคราะห์ ก็บอกตรง ๆ ว่าข้อมูลไม่พอ

## 7. How did you embody Tip 53 (Sign Your Work)?

ทำงานผ่าน branch และ PR ของตัวเอง ใส่ Pragmatic Promise ใน PR ตาม template เอกสาร Safety Net แนบผล coverage จริงจากเครื่อง ตอนเจอ conflict ที่ตัวเองทิ้งไว้ก็ยอมรับและแก้เอง และบันทึกการใช้ AI ไว้ใน `AI_USAGE.md`

## 8. What value did this experience add to your SE journey?

ได้เปลี่ยนความคิดว่างานเสร็จไม่ใช่แค่โค้ดรันได้ แต่ต้องให้คนอื่นใช้ต่อได้และไม่ทำของเดิมพัง สิ่งที่จะเอาไปใช้ต่อ:

- โปรเจกต์ต่อไปจะตั้ง CI กับ branch protection ตั้งแต่วันแรก
- ฟังก์ชันที่มีการคำนวณจะเขียน test อย่างน้อยกรณีปกติ กรณีขอบ และกรณี error ก่อน merge
- ใช้ AI ช่วยได้ แต่ต้องตรวจเองทุกครั้ง และบอกให้ชัดว่าใช้ตรงไหน