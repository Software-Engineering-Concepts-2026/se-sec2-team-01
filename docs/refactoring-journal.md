# Refactoring Journal: Milestone 1 (Lab 7)

เอกสารฉบับนี้บันทึกกระบวนการปรับปรุงเชิงโครงสร้าง (Refactoring) สำหรับ `stats-service` (Python/FastAPI) เพื่อยกระดับ Code Quality โดยไม่เปลี่ยนแปลงพฤติกรรมภายนอกของระบบ (Zero Regression) ตามข้อกำหนดของ Lab 7

---

## 1. Code Smells ที่พบ (Identified Code Smells)

จากการวิเคราะห์โค้ดเริ่มต้นของ `services/stats-service/app.py` ทีมพบ Code Smells 2 ประเด็นหลัก:

### 1.1 Poor / Vague Naming (`root`, `health`)
* **ปัญหา:** ฟังก์ชัน Route Handler เดิมตั้งชื่อว่า `def root():` และ `def health():` ซึ่งเป็นการตั้งชื่อตาม URL path (`/` และ `/health`) มากกว่าบทบาทหน้าที่ที่แท้จริง
* **ผลกระทบ:** ขัดกับหลัก **Pragmatic Programmer Tip 74 (Role-focused naming)** เพราะชื่อฟังก์ชันไม่สื่อสารเจตนาว่าทำหน้าที่อะไร เมื่อ Service ขยายตัว การอ่านโค้ดหรือการเรียกใช้ภายในจะเกิดความสับสน

### 1.2 Inline Response Construction / Mixed Responsibility
* **ปัญหา:** ภายในฟังก์ชัน Route Handler มีการสร้าง Dictionary response payload แบบ inline อยู่ร่วมกับการรับและส่งคืน HTTP response โดยตรง
* **ผลกระทบ:** ขัดกับ **Single Responsibility Principle (SRP)** ในระดับฟังก์ชัน ทำให้ Handler มีหน้าที่ผสมกันทั้งการจัดการ HTTP transport และการประกอบโครงสร้างข้อมูล payload ส่งผลให้ไม่สามารถนำ payload logic ไป reuse หรือทำ Unit test logic การสร้างข้อมูลแยกจาก FastAPI router ได้

---

## 2. AI Usage Workflow (Explain -> Propose -> Apply -> Test)

ทีมประยุกต์ใช้ AI (ChatGPT / Codex) ในฐานะ **Pair Programming Assistant** ตามลำดับขั้นตอน 4 เฟสอย่างเป็นระบบ:

```
[1. Explain]  -->  [2. Propose]  -->  [3. Apply]  -->  [4. Test]
 วิเคราะห์ Smell      เสนอทางเลือก          ตรวจสอบ diff       รัน Pytest
                     Role-focused         นำโค้ดลง repo      ยืนยัน 2 passed
```

1. **Explain (ทำความเข้าใจปัญหา):**
   * ป้อนโค้ด `services/stats-service/app.py` ให้ AI ช่วยอธิบาย smell ในมิติของ Naming และ Responsibility
   * Prompt: *"อ่าน FastAPI service นี้แล้วระบุ code smell ด้าน naming และ endpoint responsibility พร้อมเหตุผล"*
2. **Propose (เสนอแนวทางแก้ปัญหา):**
   * ให้ AI เสนอชื่อฟังก์ชันใหม่ที่เป็น Role-focused และเสนอเทคนิค Extract Method แยก payload builder
   * Prompt: *"เสนอชื่อฟังก์ชันที่สื่อความหมายกว่า root และ health โดยคง HTTP contract เดิม"*
   * พร้อมทั้งขอ test cases สำหรับ verify: *"ช่วยเสนอ test cases สำหรับตรวจว่า endpoint / และ /health ยังคืน status และ JSON เดิมหลัง refactor"*
3. **Apply (นำโค้ดมาปรับปรุงจริง):**
   * ทีมตรวจสอบ diff และคัดกรองเฉพาะส่วนที่จำเป็น โดยเลือกใช้ชื่อ:
     * Handler: `service_info` และ `health_check`
     * Payload builder: `get_service_info_payload()` และ `get_health_payload()`
   * ยึดตาม Scope เดิม ไม่เพิ่ม abstractions หรือลูกเล่นที่เกินความจำเป็น
4. **Test (ทดสอบเพื่อยืนยัน):**
   * รัน `python -m pytest -q services/stats-service/tests` เพื่อยืนยันว่า Contract เดิมของ `/` และ `/health` ผ่าน 100%

---

## 3. ตารางเปรียบเทียบ Before vs After

| มิติการเปรียบเทียบ | ก่อน Refactor (Before) | หลัง Refactor (After) | ประโยชน์ที่ได้รับ (Benefits) |
| :--- | :--- | :--- | :--- |
| **Route Handler Naming** | `def root():`<br>`def health():` | `def service_info():`<br>`def health_check():` | สื่อสารบทบาทหน้าที่ชัดเจนตาม Tip 74 (Role-focused naming) อ่านเข้าใจง่ายโดยไม่ต้องพึ่ง comment |
| **Response Construction** | Inline Dictionary ภายใน Handler โดยตรง | แยกเป็นฟังก์ชันย่อย:<br>`get_service_info_payload()`<br>`get_health_payload()` | แยกความรับผิดชอบ (Separation of Concerns) ทำให้โค้ดสะอาดและเป็นระเบียบ |
| **Constants Management** | Hardcoded string `"stats-service"`, `"0.1.0"` | กำหนดเป็น Module Constants:<br>`SERVICE_NAME: Final[str]`<br>`SERVICE_VERSION: Final[str]` | ลดความซ้ำซ้อนตามหลัก DRY และป้องกัน typo |
| **Testability** | ต้องจำลอง HTTP client ยิงเข้า endpoint เท่านั้น | สถาปัตยกรรมโค้ดรองรับการ Unit test แยกเฉพาะฟังก์ชัน payload builder ได้โดยตรงในอนาคต โดยในการทดสอบปัจจุบันมุ่งเน้น Contract Tests ผ่าน HTTP TestClient เพื่อยืนยันว่า response contract ไม่เปลี่ยนแปลง | แยกขอบเขตการทดสอบระหว่าง Transport layer กับ Data layer ชัดเจน |
| **API Contract & Response** | `{"service": "stats-service", "status": "ok"}`<br>`{"status": "healthy"}` | `{"service": "stats-service", "status": "ok"}`<br>`{"status": "healthy"}` | คงผลลัพธ์ HTTP 200 JSON เดิม 100% (Zero Regression) |

---

## 4. บทเรียนที่ได้รับและการตัดสินใจทางวิศวกรรม (Lessons Learned)

1. **Test-First เป็น Safety Net ที่สำคัญที่สุด:**
   การสร้าง Contract Tests (`test_app.py`) ให้ครอบคลุมทั้ง 2 endpoints ก่อนลงมือแก้โค้ด ทำให้ทีมมีความมั่นใจเต็ม 100% ในทุกการ refactor ว่าจะไม่ส่งผลกระทบต่อ behavior เดิม
2. **การคุม Scope (Avoid Over-engineering):**
   ในการ refactor ครั้งนี้ ทีมเลือกใช้ฟังก์ชันย่อยธรรมดาและ module constants ที่อ่านง่าย ไม่รีบนำ Pattern ซับซ้อน (เช่น Abstract Factory หรือ Class-based service) มาใช้ เพราะ service ปัจจุบันยังมีขนาดเล็ก การ refactor ต้องพอดีกับบริบทจริง
3. **บทบาทของ AI คือ Assistant ไม่ใช่ Decision Maker:**
   AI ทำหน้าที่ได้ดีในการจุดประกายไอเดียและร่างโครงสร้าง แต่ทีมต้องเป็นผู้กำหนดกรอบ, ตรวจสอบ diff, และตัดสินใจเลือกชื่อที่สอดคล้องกับ repository ทั้งหมด

---

### Historical Traceability

เมื่อเปรียบเทียบกับ `main` ไฟล์
`services/stats-service/app.py` อาจแสดงเป็น `New File`
เนื่องจากใน `main` ณ เวลาที่สร้าง PR ยังไม่มีไฟล์ใน path นี้

โค้ดส่วน Before ที่แสดงด้านล่างเป็น baseline จากเวอร์ชันก่อน
การ refactor ซึ่งใช้สำหรับเปรียบเทียบกับโค้ด After และตรวจสอบว่า
พฤติกรรมของ endpoint ยังคงทำงานได้เหมือนเดิมผ่าน automated tests

### โค้ดเดิมก่อน Refactor (Before):
```python
from fastapi import FastAPI

app = FastAPI(
    title="Stats Service",
    version="0.1.0"
)

@app.get("/")
def root():
    return {
        "service": "stats-service",
        "status": "ok"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
```

### โค้ดหลัง Refactor (After - Commit ปัจจุบัน):
```python
from typing import Final
from fastapi import FastAPI

SERVICE_NAME: Final[str] = "stats-service"
SERVICE_VERSION: Final[str] = "0.1.0"

app = FastAPI(
    title=SERVICE_NAME,
    version=SERVICE_VERSION,
)

def get_service_info_payload() -> dict[str, str]:
    return {
        "service": SERVICE_NAME,
        "status": "ok",
    }

def get_health_payload() -> dict[str, str]:
    return {"status": "healthy"}

@app.get("/")
def service_info() -> dict[str, str]:
    return get_service_info_payload()

@app.get("/health")
def health_check() -> dict[str, str]:
    return get_health_payload()
```
> **สรุป:** การ Refactor ได้สกัด Module Constants, เปลี่ยนชื่อ Handlers ให้เป็น Role-focused (`root` $\rightarrow$ `service_info`, `health` $\rightarrow$ `health_check`), และแยก Payload functions (`get_service_info_payload`, `get_health_payload`) โดยยังคงผลลัพธ์ HTTP 200 JSON เดิมไว้ครบถ้วน 100%
