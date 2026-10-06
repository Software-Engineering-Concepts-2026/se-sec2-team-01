# Safety Net ของทีม Need to rest

## 1. ฟังก์ชันที่เลือกทดสอบ
-ฟังก์ชัน: calculate_discount — อยู่ไฟล์ services/stats-service/app.py
-เหตุผลที่เลือก: เป็น Pure Function ที่เป็น Core Business Logic สำหรับคำนวณส่วนลด ซึ่งมีผลกระทบต่อความถูกต้องทางการเงินของผู้ใช้งานโดยตรง และไม่มี External Dependencies (ไม่ต้องต่อ Database หรือ External API) เหมาะสมที่สุดสำหรับการทำ Safety Net และ Automated Unit Testing


## 2. เทสต์ที่เขียน (≥ 5 ตัว)
| # | ชื่อเทสต์ | ประเภท | ยืนยันอะไร |
|---|---|---|---|
| 1 | test_calculate_discount_standard_percentage | happy | ยอด 100 ลด 10% -> ยอดจ่ายสุทธิคือ 90 |
| 2 | test_calculate_discount_accepts_fractional_percentage | happy | รองรับเปอร์เซ็นต์ทศนิยม (ยอด 80 ลด 12.5% -> จ่าย 70) |
| 3 | test_calculate_discount_keeps_amount_when_percentage_is_zero | edge | ยอดเงินเมื่อส่วนลด 0% จะเท่าเดิมไม่ถูกหัก (1234.56 -> 1234.56) |
| 4 | test_calculate_discount_zero_amount_at_full_percentage_is_zero | edge | ลดเต็มจำนวน 100% ยอดสุทธิต้องเป็น 0 |
| 5 | test_calculate_discount_large_finite_amount_stays_finite | edge | ยอดเงินจำนวนมหาศาล (1,000,000,000 ลด 25% -> 750,000,000) คำนวณได้ถูกต้อง ไม่เกิด overflow |
| 6 | test_calculate_discount_rejects_negative_amount | error | ยอดเงินติดลบ (-1) ต้อง raise ValueError ("non-negative") |
| 7 | test_calculate_discount_rejects_non_finite_percentage | error | เปอร์เซ็นต์เป็น NaN หรืออยู่นอกช่วง 0-100 ต้อง raise ValueError |
| 8 | test_calculate_discount_rejects_non_finite_amount | error | ยอดเงินที่เป็น NaN/Infinity ต้อง raise ValueError ("finite") |

## 3. Coverage (วางผลลัพธ์จริงจากเครื่องตัวเอง)
![coverage-result](./images/coverage.png)
ตีความ: ชุดการทดสอบครอบคลุมเส้นทางทั้งหมด 100% (happy path, boundary/edge cases และ error handling) ของการทำงานใน app.py โดยเฉพาะฟังก์ชันคำนวณส่วนลด calculate_discount รันผ่านครบ 15 tests
ส่วนที่ยังไม่ครอบคลุม + เหตุผลที่ยอมรับความเสี่ยง: ไม่มี (N/A) เนื่องจากทดสอบครอบคลุมครบ 100% (Miss = 0 บรรทัด) ไม่มีโค้ดส่วนที่ตกหล่น

## 4. CI block อะไรบ้าง
-`lint` (ruff): รูปแบบโค้ด — เจอ import ไม่ได้ใช้ = แดง
-`test` (pytest): เทสต์ทั้งหมด + coverage
![test-result](./images/result.png)

## 5. บทเรียนที่ได้
-เรียนรู้เรื่องฟังก์ชั่น และผลกระทบของมัน หากเกิดข้อผิดพลาดขึ้นมา

-เรียนรู้วิธีการตั้งค่า Branch Protection และ Rulesets บน GitHub เพื่อบังคับใช้ CI เช็กสถานะก่อน Merge 

-ได้ฝึกแก้ไขปัญหาและการจัดการ Import รวมถึงการเขียนเทสต์ครอบคลุมทั้ง Boundary และ Error Handling 