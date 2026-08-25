# Lab 3 Reflection — Requirements Documents

## 1. Magic Shipping

การเขียน requirements ให้ดูครบจำนวนไฟล์ไม่เท่ากับการมี requirements ที่ใช้พัฒนาต่อได้จริง ถ้าเรารีบส่ง persona, scenario และ user story โดยไม่ตรวจ traceability ทีมอาจสร้าง feature ที่ไม่มีผู้ใช้หรือไม่ช่วยแก้ pain point ของต้นกับปุ๊ก ดังนั้นทีมต้องตรวจว่าแต่ละ story มีที่มาจาก scenario และมี acceptance criteria ที่ทดสอบได้

## 2. NFR ไม่ควรเป็นเพียงคำคุณศัพท์

คำว่า “เร็ว”, “ปลอดภัย” หรือ “ใช้งานง่าย” ยังไม่ช่วยให้ทีมตัดสินว่าผ่านหรือไม่ผ่าน เราจึงเปลี่ยนเป็น metric เช่น p95 response time, จำนวนผู้ใช้ที่ทำ task สำเร็จ, authorization test pass rate และ coverage ตัวเลขเหล่านี้ยังเป็น draft ที่ต้อง validate แต่ทำให้ทีมเห็นวิธีทดสอบและพูดคุย trade-off ได้ชัดขึ้น

## 3. User Story ที่ดีต้องบอกคุณค่าของผู้ใช้

การเขียน “ทำ dashboard” เป็น task มากกว่า user story เราจึงใช้รูปแบบ As a / I want / So that และผูกกับ persona, scenario, priority, estimate และ acceptance criteria ก่อนนำไปสร้าง Issue การแยก user value ออกจาก implementation ช่วยให้ทีมตัด feature ที่ไม่จำเป็นและรักษา scope ของ Sprint ได้

## สิ่งที่จะปรับใน Sprint ถัดไป

ทีมจะตรวจ requirements ด้วย traceability table ก่อนเริ่มเขียน production code และจะ validate ตัวเลข NFR กับ test data จริง เมื่อมี prototype หรือ service ที่รันได้แล้ว
