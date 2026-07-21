# 🌙 Goodnight - เอกสารสถาปัตยกรรม

> **แพลตฟอร์มเพิ่มประสิทธิภาพการนอนหลับ** | C4 Model & Architecture Decision Records

---

## 📋 สารบัญ

- [ภาพรวม](#ภาพรวม)
- [แผนภาพ C4 Model](#แผนภาพ-c4-model)
  - [ระดับ 1: System Context (C1)](#ระดับ-1-system-context-c1)
  - [ระดับ 2: Container Diagram (C2)](#ระดับ-2-container-diagram-c2)
- [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)
- [สรุป Tech Stack](#สรุป-tech-stack)
- [วิธีการดูแผนภาพ](#วิธีการดูแผนภาพ)

---

## ภาพรวม (Overview)

Goodnight เป็น **แพลตฟอร์มเว็บสำหรับเพิ่มประสิทธิภาพการนอนหลับ** ที่ออกแบบมาสำหรับบุคคลที่ให้ความสำคัญด้านสุขภาพ ซึ่งต้องการ:

1. **ติดตามและวัดผล** รูปแบบการนอนของตนเองโดยใช้ข้อมูลจาก wearable devices
2. **เข้าใจสาเหตุราก** ของปัญหาการนอนผ่านการวิเคราะห์ที่ขับเคลื่อนด้วย AI
3. **รับคำแนะนำที่เหมาะสมกับตัวเอง** ตาม patterns และไลฟ์สไตล์เฉพาะบุคคล

### ผู้ใช้หลัก

| Persona | คำอธิบาย | ความต้องการหลัก |
|---------|----------|-------------------|
| 👨‍💼 **ต้น (Ton)** | ผู้ใช้กลุ่ม Health-Optimizing, PM @ Fintech | ข้อมูลเชิงลึก, การแสดงผลแนวโน้ม, การปรับปรุงตนเอง |
| 👩‍💼 **ปุ๊ก (Pook)** | ผู้ใช้กลุ่ม Sleep-Challenged, Marketing Manager | การวิเคราะห์สาเหตุ, การ coach ที่ทำได้จริง, คำอธิบายชัดเจน |

---

## แผนภาพ C4 Model

เราใช้ **C4 Model** เพื่อแสดงภาพสถาปัตยกรรมซอฟต์แวร์ของเราในระดับ abstraction ที่แตกต่างกัน คล้ายกับ Google Maps ที่อนุญาตให้ซูมเข้า/ออกเพื่อดูรายละเอียดในระดับต่างๆ

### ระดับ 1: System Context (C1)

**ไฟล์:** `diagrams/goodnight-c1-context.xml` (รูปแบบ draw.io)

แผนภาพ **System Context** แสดงระบบของเราเป็นกล่องดำ (black box) โดยโฟกั斯ที่:

- **ใคร** กำลังใช้ระบบของเรา (Users/Actors)
- **อะไร** คือระบบภายนอกที่เราต้อง interact ด้วย
- **อย่างไร** ข้อมูลไหลเวียนระหว่างพวกเขา

#### องค์ประกอบหลัก:

```
┌─────────────────────────────────────────────────────────────┐
│                    โลกภายนอก (External World)                │
│                                                             │
│   ┌──────────┐     ┌──────────────────┐     ┌───────────┐  │
│   │   ต้น    │────>│                  │<----│ Wearables │  │
│   │  (User)  │     │   🌙 Goodnight   │     │  Devices  │  │
│   └──────────┘     │    Platform      │     └───────────┘  │
│                     │                  │                    │
│   ┌──────────┐     │   [ระบบของเรา]    │     ┌───────────┐  │
│   │  ปุ๊ก     │────>│                  │<----│ Health API│  │
│   │  (User)  │     └────────┬─────────┘     └───────────┘  │
│   └──────────┘              │               ┌───────────┐  │
│                             ├──────────────>│ Notification│ │
│                             │               │  Service   │  │
│                             ├──────────────>└───────────┘  │
│                             │               ┌───────────┐  │
│                             └──────────────>│ Calendar  │  │
│                                             │   API     │  │
│                                             └───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### การ Interact ที่บันทึก:

| จาก | ไปยัง | การ Interact |
|------|-------|---------------|
| ต้น (Ton) | Goodnight | ดู dashboard, บันทึกกิจกรรมและอารมณ์ |
| Goodnight | ต้น (Ton) | คำแนะนำเฉพาะบุคคล, แนวโน้มรายสัปดาห์ |
| ปุ๊ก (Pook) | Goodnight | ติดตามรูปแบบการนอน, ดู insights |
| Goodnight | ปุ๊ก (Pook) | การวิเคราะห์สาเหตุ, การ coach เฉพาะบุคคล |
| Goodnight | Wearable Devices | Sync ข้อมูลการนอนและสุขภาพ (HRV, stages) |
| Goodnight | Health API | นำเข้าข้อมูลสุขภาพในอดีต |
| Goodnight | Notification Service | ส่งการเตือน, สรุปรายสัปดาห์ |
| Goodnight | Calendar API | สร้างกิจกรรมนัดหมายการนอน |

---

### ระดับ 2: Container Diagram (C2)

**ไฟล์:** `diagrams/goodnight-c2-container.xml` (รูปแบบ draw.io)

แผนภาพ **Container** ซูมเข้าไปในขอบเขตระบบของเรา และแสดงองค์ประกอบเทคโนโลยีหลักๆ (containers) ที่ประกอบขึ้นเป็นแพลตฟอร์ม Goodnight

#### ภาพรวมสถาปัตยกรรม:

```
┌──────────────────────────────────────────────────────────────────┐
│                     🌙 Goodnight Platform                        │
│                      [ขอบเขตระบบ]                              │
│                                                                   │
│   ┌─────────────────┐        ┌─────────────────┐                │
│   │  🖥️ Frontend    │ REST   │  ⚙️ Backend API  │                │
│   │  React + Vite   │<──────>│  Python + Flask  │                │
│   │                 │ JSON   │                 │                │
│   └─────────────────┘        └────────┬────────┘                │
│                                        │                         │
│                         SQL            │ gRPC/REST              │
│                         ▼              ▼                         │
│   ┌─────────────────┐        ┌─────────────────┐                │
│   │  🗄️ Database    │<───────│  🤖 AI Service   │                │
│   │  PostgreSQL     │  Read  │  Python + ML    │                │
│   └─────────────────┘        └─────────────────┘                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
         ▲                              ▲
         │                              │
    Users (Browser)           External APIs
```

#### Containers:

| Container | Technology | หน้าที่รับผิดชอบ |
|-----------|-----------|---------------------|
| **Frontend Web App** | React + Vite | ส่วนติดต่อผู้ใช้, dashboard, การแสดงผลข้อมูล |
| **Backend API** | Python + Flask | Business logic, การประมวลผลข้อมูล, external integrations |
| **Primary Database** | PostgreSQL | การจัดเก็บข้อมูลถาวรสำหรับ users, sleep records, metrics |
| **AI Analytics Service** | Python + scikit-learn/OpenAI | การวิเคราะห์ patterns, การสร้าง insights, คำแนะนำ |

---

## Architecture Decision Records (ADRs)

Architecture Decision Records บันทึก **การตัดสินใจด้านสถาปัตยกรรม** ที่สำคัญ พร้อมบริบทและผลที่ตามมา

### ดัชนี ADR

| หมายเลข | ชื่อเรื่อง | สถานะ | วันที่ |
|---------|----------|--------|--------|
| **ADR-001** | การเลือก Tech Stack หลัก | ✅ ยอมรับ | 2026-07-21 |

### ADR-001: Tech Stack Selection

**สรุป:** เราเลือก React + Vite สำหรับ frontend, Python + Flask สำหรับ backend, PostgreSQL สำหรับ database พร้อม deploy บน Vercel + Railway

**การตัดสินใจหลัก:**
- **Frontend:** React + Vite (ทีมคุ้นเคย, ecosystem ดี, DX ดี)
- **Backend:** Python + Flask (การผสาน ML/AI, อ่านง่าย)
- **Database:** PostgreSQL (ACID, JSONB, รองรับ time-series)
- **Deployment:** Vercel (FE) + Railway/Render (BE) - free tiers

📄 **เอกสารฉบับเต็ม:** `adr/0001-tech-stack-selection.md`

---

## สรุป Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                   GOODNIGHT TECH STACK                       │
├─────────────────────────────────────────────────────────────┤
│  Layer          │  Technology                                │
├─────────────────┼───────────────────────────────────────────┤
│  Frontend       │  React 18+ / Vite / TypeScript             │
│  Styling        │  Tailwind CSS / shadcn/ui                 │
│  State Mgmt     │  TanStack Query / Context API              │
│  Charts         │  Recharts / D3.js                          │
├─────────────────┼───────────────────────────────────────────┤
│  Backend        │  Python 3.11+ / Flask 3.x                  │
│  API Style      │  RESTful / OpenAPI 3.0                     │
│  ORM            │  SQLAlchemy 2.0 (async)                    │
│  Validation     │  Pydantic v2                               │
├─────────────────┼───────────────────────────────────────────┤
│  Database       │  PostgreSQL 15+                            │
│  Cache (future) │  Redis (เมื่อต้องการ)                     │
├─────────────────┼───────────────────────────────────────────┤
│  AI/ML          │  scikit-learn / OpenAI API / pandas        │
├─────────────────┼───────────────────────────────────────────┤
│  Auth           │  JWT (access + refresh tokens)              │
├─────────────────┼───────────────────────────────────────────┤
│  Deploy (FE)    │  Vercel (CI/CD from GitHub)                │
│  Deploy (BE)    │  Railway or Render                         │
│  Infra          │  Docker Compose (local dev)                │
│  CI/CD          │  GitHub Actions                             │
└─────────────────────────────────────────────────────────────┘
```

---

## วิธีการดูแผนภาพ

### วิธีที่ 1: Draw.io (แนะนำ)

1. ไปที่ **[app.diagrams.net](https://app.diagrams.net)**
2. คลิก **"Open Existing Diagram"**
3. เลือก **"From Device"** และเลือกไฟล์ `.xml`:
   - `goodnight-c1-context.xml` — System Context (C1)
   - `goodnight-c2-container.xml` — Container Diagram (C2)

### วิธีที่ 2: VS Code Extension

1. ติดตั้ง Extension **"Draw.io Integration"**
2. เปิดไฟล์ `.xml` โดยตรงใน VS Code
3. แก้ไขและ export เป็น PNG/SVG/PDF

### วิธีที่ 3: Export ผ่าน Command Line

```bash
# Export เป็น PNG โดยใช้ draw.io CLI (ต้องการ Node.js)
npx drawio-cli export --xml goodnight-c1-context.xml --output c1-context.png --format png
npx drawio-cli export --xml goodnight-c2-container.xml --output c2-container.png --format png
```

---

## โครงสร้าง Directory

```
docs/
└── architecture/
    ├── README.md                          # ไฟล์นี้
    ├── diagrams/
    │   ├── goodnight-c1-context.xml       # C1: System Context
    │   └── goodnight-c2-container.xml     # C2: Container Diagram
    └── adr/
        └── 0001-tech-stack-selection.md   # ADR-001: Tech Stack
```

---

## การมีส่วนร่วม (Contributing)

เมื่อทำการเปลี่ยนแปลงสถาปัตยกรรม:

1. สร้าง ADR ใหม่โดย follow template จาก `adr/0001-tech-stack-selection.md`
2. อัปเดตแผนภาพ C4 ที่เกี่ยวข้อง หากโครงสร้างระบบเปลี่ยนแปลง
3. Submit PR พร้อม label `[architecture]` เพื่อ review

---

*อัปเดตล่าสุด: 2026-07-21 | โปรเจกต์: Goodnight | เวอร์ชัน: 0.1.0*
