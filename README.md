# Project: [Good Night]
Sleep tracker ติดตาม วิเคราะห์และช่วยให้คำแนะนำเพื่อปรับปรุงพฤติกรรมการนอนของผู้ใช้

## Team: [Need to rest]
- [นางสาวรุ่งระวี แก้วงาม], GitHub: `[@lowkeyraining]`
- [นายดนุเดช นายกุม], GitHub: `[@Danudet888]`
- [นายอดิศักดิ์ เกาะสังข์], GitHub: `[@Adisakx2548]`

---

## 🚀 Getting Started

This section explains how to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- Git
- Python 3.10+
- Docker & Docker Compose

### Running the Application (with Docker)

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd [your-project-folder]
    ```

2.  **Run the services:**
    *(This section will be updated in later weeks when using Docker Compose)*
    ```bash
    # Build from the repository root using the Lab 6 Dockerfile
    docker build -t adisakx2548/stats-service:v0.1.0 .
    docker run --rm -p 8000:8000 adisakx2548/stats-service:v0.1.0
    ```

---

## 🏛️ Architecture & Design

Key architectural decisions and diagrams are documented in the `/docs/architecture` directory.

- **[C4 Models & Tech Stack](./docs/architecture/README.md)**
- **[Architectural Decision Records (ADRs)](./docs/architecture/adr/)**

## 👥 Requirements

User personas and key scenarios that drive our development are located in the `/docs/requirements` directory.

- **[User Personas](./docs/requirements/personas/)**
- **[Main User Scenario](./docs/requirements/main_scenario.md)**

---

## 🤝 Ways of Working

เอกสารนี้กำหนดวิธีการทำงานร่วมกันของทีม เป็นข้อตกลงที่ปรับเปลี่ยนได้เสมอ — ถ้ามีจุดไหนไม่เวิร์ค ให้ยกขึ้นมาคุยใน Retrospective แล้วปรับปรุงร่วมกัน

### 1. ความถี่ของการประชุม (Meeting Cadence)

| การประชุม | ความถี่ | ระยะเวลา | จุดประสงค์ |
|---|---|---|---|
| **Sprint Planning** | 1 ครั้ง/สปรินต์ (ต้น sprint) | 45–60 นาที | กำหนดเป้าหมายของ sprint, แบ่งและมอบหมายงานจาก backlog |
| **Daily Stand-up** | สัปดาห์ละ 3 วัน (เช่น จ./พ./ศ.) | 10–15 นาที | อัปเดตสั้นๆ: ทำอะไรไปแล้ว, กำลังทำอะไร, มีอะไรติดขัด |
| **Mid-Sprint Check-in** | 1 ครั้ง/สปรินต์ (กลาง sprint) | 15–20 นาที | ดักจับปัญหา scope ที่บวมเกินหรือ blocker ตั้งแต่เนิ่นๆ |
| **Sprint Review/Demo** | 1 ครั้ง/สปรินต์ (ปลาย sprint) | 20–30 นาที | สาธิตฟีเจอร์ที่ทำเสร็จให้ทีม (และอาจารย์/ผู้ดูแลโปรเจกต์) ดู |
| **Retrospective** | 1 ครั้ง/สปรินต์ (หลัง Review) | 20–30 นาที | คุยว่าอะไรไปดี/ไม่ดี และหา action item 1 ข้อไปลองทำใน sprint ถัดไป |

**หมายเหตุ:**
- Daily Stand-up ในทางปฏิบัติคือ 3 วัน/สัปดาห์ เพราะทีมนักศึกษามีตารางเรียนชนกัน ไม่จำเป็นต้องทุกวัน วันที่ไม่มีประชุมให้อัปเดตผ่านข้อความ (เช่น thread ใน Discord/Slack) แทนได้
- แนะนำให้ใช้ **sprint ละ 1 สัปดาห์** เพื่อให้ feedback loop สั้นและไม่หลุดทิศทางนาน
- ทุกการประชุมต้อง timebox เสมอ — ถ้าประชุมมีแนวโน้มจะยาวเกินกำหนด แสดงว่าเรื่องนั้นควรย้ายไปคุยแบบ async แทน

### 2. กฎการสื่อสาร (Communication Rules)

**ช่องทางหลัก:** Instagram Group Chat, Discord

- **เวลาตอบกลับที่คาดหวัง:** ตอบรับข้อความภายใน **24 ชั่วโมง** ในวันธรรมดา "ตอบรับ" ไม่ได้แปลว่าต้องตอบครบทุกอย่าง แค่กด 👍 หรือพิมพ์ "เดี๋ยวเช็คให้ จะตอบคืนนี้" ก็ถือว่าผ่าน
- **ใช้ Thread ไม่ใช่สแปมในช่องหลัก:** การสนทนาที่ยาวเกิน 2–3 ข้อความในประเด็นเดียวกัน ให้ย้ายไปคุยใน **thread** เพื่อให้ช่องหลักอ่านง่าย ไม่รก
- **DM กับการพูดในที่สาธารณะ:** ให้คุยเรื่องที่เกี่ยวกับโปรเจกต์ในช่องทางสาธารณะเป็นหลัก — ทั้งการตัดสินใจ, blocker, คำถามต่างๆ แม้จะรู้สึกว่าเป็นแค่ "คำถามเล็กๆ" ก็ตาม เพื่อให้ทุกคนรับรู้ข้อมูลเท่ากันและไม่เกิดความรู้ที่กระจุกอยู่กับคนใดคนหนึ่ง ส่วน DM ใช้เฉพาะเรื่องส่วนตัวหรือเรื่องที่ละเอียดอ่อนจริงๆ
- **แจ้ง Blocker ทันที** ไม่ต้องรอถึงวันประชุมครั้งต่อไป เพราะ blocker ที่ถูกเก็บไว้เงียบๆ 2 วัน คือความเสี่ยงของทั้งทีม
- **ห้าม "หายเงียบ"** ถ้าทำงานไม่ทันตามกำหนด หรือเข้าประชุมไม่ได้ ให้บอกล่วงหน้า อย่าเงียบไปเฉยๆ — เข้าใจว่าทุกคนมีชีวิตส่วนตัว แค่ขอให้แจ้งทีมก่อน
- **แท็กให้ตรงจุด** ใช้ @mention เฉพาะเมื่อต้องการให้คนนั้นลงมือทำอะไรจริงๆ ไม่ใช่แท็กพร่ำเพรื่อสำหรับอัปเดตทั่วไป

### 3. Git Workflow

**โมเดล Branching:** Simplified Git Flow

```
main          → โค้ดที่สเถียรและพร้อม deploy เสมอ
develop       → branch รวมงาน, โค้ดเวอร์ชันล่าสุดที่ใช้งานได้
feature/*     → feature/sleep-quality-chart
fix/*         → fix/timezone-bug
```

- งานทุกอย่างทำบน branch `feature/*` หรือ `fix/*` ที่แตกออกมาจาก `develop`
- **ห้าม commit ตรงเข้า `main` หรือ `develop` เด็ดขาด**
- การตั้งชื่อ branch: `feature/short-description` หรือ `fix/short-description` (ตัวพิมพ์เล็ก, ใช้ขีดกลาง)

**Commit Message:**
- ใช้รูปแบบ: `type: คำอธิบายสั้นๆ` (เช่น `feat: add sleep duration chart`, `fix: correct timezone bug in sleep log`)
- ประเภทที่ใช้บ่อย: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- บรรทัดแรกไม่ควรเกิน ~50 ตัวอักษร ถ้าต้องการรายละเอียดเพิ่ม ให้เขียนต่อในบรรทัดถัดไป

**Pull Request:**
- เปิด PR จาก branch `feature/*` ของคุณ เข้าไปที่ `develop`
- รายละเอียดใน PR ต้องระบุ: เปลี่ยนแปลงอะไร, ทำไม, และทดสอบยังไง (แค่ 2–3 bullet point ก็พอ)
- **ต้องมีสมาชิกอีกคนอย่างน้อย 1 คน รีวิวและอนุมัติก่อนจึง merge ได้** ห้าม merge งานของตัวเอง
- สิ่งที่ผู้รีวิวต้องเช็ค: โค้ดทำงานได้จริงไหม, อ่านเข้าใจไหม, ตรงตาม pattern ที่ใช้อยู่ในโปรเจกต์ไหม — ไม่ใช่การจับผิดเรื่องเล็กๆ
- ต้องแก้ไข comment ที่รีวิวให้ครบก่อน merge (หรือถ้าไม่เห็นด้วยก็ต้องคุยกันให้ชัดเจนก่อน)
- ใช้ **"Squash and merge"** เพื่อให้ history ของ `develop` สะอาด
- ลบ branch ทิ้งหลัง merge เสร็จ
- merge จาก `develop` เข้า `main` เฉพาะตอนปลาย sprint เมื่อ build มั่นใจว่าสเถียรแล้ว (เช่น หลังจาก demo)

### 4. การตัดสินใจ (Decision Making)

ใช้แนวทางแบบลำดับขั้น — ส่วนใหญ่ไม่ต้องประชุมก็ตัดสินใจได้ แต่บางเรื่องต้องคุยกัน:

1. **เรื่องเล็กที่ปรับเปลี่ยนได้ง่าย** (ชื่อตัวแปร, UI ปรับเล็กน้อย, เลือก library สำหรับฟีเจอร์ที่ไม่สำคัญมาก): **ให้คนที่ลงมือทำงานนั้นตัดสินใจเอง** ไม่ต้องรอ consensus สำหรับเรื่องที่แก้ไขทีหลังได้ง่าย
2. **เรื่องที่กระทบทั้งทีม** (architecture โดยรวม, เทคโนโลยีหลักที่ใช้, data model, API contract): คุยกันในที่ประชุมหรือ thread โดย **มุ่งหา consensus** ให้ทุกคนมีโอกาสแสดงความเห็นก่อนตัดสินใจ
3. **ถ้าหา consensus ไม่ได้หลังจากคุยกันพอสมควรแล้ว** (timebox ไว้ — แค่ 15 นาทีก็พอที่จะเห็น trade-off ที่แท้จริง): ให้ใช้วิธี **โหวต** เสียงข้างมากชนะ
4. **ถ้าโหวตเสมอกัน หรือทีมตกลงกันไม่ได้จริงๆ** ให้ **Tech Lead ที่กำหนดไว้** เป็นผู้ชี้ขาด (จะหมุนเวียนตำแหน่งนี้ทุก sprint หรือกำหนดตายตัวทั้งโปรเจกต์ก็ได้ ตามที่ทีมตกลงกัน)
5. **บันทึกการตัดสินใจไว้เสมอ** — แค่โน้ตสั้นๆในช่องแชทหรือ README ("ตัดสินใจ: ใช้ SQLite สำหรับ MVP ค่อยพิจารณาเปลี่ยนทีหลังถ้าต้อง scale") เพื่อไม่ต้องเถียงเรื่องเดิมซ้ำอีกใน 2 สัปดาห์ข้างหน้าโดยไม่มีข้อมูลใหม่

**หลักการ:** Disagree and commit — ไม่เห็นด้วยก็ทำตาม เมื่อตัดสินใจแล้ว ทีมต้องเดินหน้าไปด้วยกัน แม้บางคนจะยังไม่เห็นด้วย 100% ก็ตาม ความกังวลสามารถนำมาคุยใหม่ได้ถ้ามีข้อมูลใหม่เข้ามา แต่ไม่ใช่การรื้อประเด็นเดิมขึ้นมาเถียงซ้ำทุก sprint
