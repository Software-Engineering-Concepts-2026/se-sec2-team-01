# Saboteur Testing Journal — Lab 9

## Manual sabotage

- **Target:** `services/stats-service/app.py` — ขอบเขต percentage สูงสุดใน `calculate_discount`
- **Intentional change:** เปลี่ยน `percentage > 100` เป็น `percentage >= 100` เพื่อจำลองบั๊กที่ปฏิเสธส่วนลด 100% ซึ่งเป็น input ที่ถูกต้อง
- **Expected behavior:** ส่วนลด 100% ต้องคืนยอดสุทธิเป็น `0`
- **Tests run:**
  `python -B -m pytest -q -p no:cacheprovider services/stats-service/tests/test_calculate_discount.py::test_calculate_discount_boundary_hundred tests/test_property.py::test_full_discount_returns_zero`

## Detection result

- ระหว่าง sabotage ทั้งสอง tests ล้มเหลว (**2 failed**) ตามคาด
- Hypothesis ย่อกรณี property ที่ล้มเหลวเป็น `amount=0` และ `percentage=100`; unit test ก็จับ boundary 100% โดยตรง
- คืนเงื่อนไขเป็น `percentage > 100` แล้วรันคำสั่งเดิมซ้ำ ได้ผล **2 passed**

## CI status

- การ sabotage และผล 2 failed/2 passed ข้างต้นเป็นการทดสอบในเครื่องเท่านั้น; ไม่ได้ push โค้ดที่จงใจ break
- หลัง push โค้ดที่คืนสภาพแล้ว ต้องตรวจผล workflow บน GitHub และตั้ง required status check ใน branch protection ให้ block merge; สถานะเหล่านี้ยังไม่ได้ยืนยัน
