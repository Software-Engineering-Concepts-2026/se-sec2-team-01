# ADR-001: การเลือกชุดเทคโนโลยีหลัก (Tech Stack Selection)

**สถานะ:** ยอมรับ (Accepted)  
**วันที่:** 2026-07-21  
**ผู้ตัดสินใจ:** ทีมพัฒนา (โปรเจกต์ Goodnight)

---

## บริบท (Context)

โปรเจกต์ของเรา **Goodnight** เป็น **แพลตฟอร์มเว็บสำหรับเพิ่มประสิทธิภาพการนอนหลับ** ที่ออกแบบมาสำหรับ **บุคคลที่ให้ความสำคัญด้านสุขภาพ** ซึ่งต้องการติดตาม เข้าใจ และปรับปรุงคุณภาพการนอนของตนเองผ่านข้อมูลเชิงลึกที่ขับเคลื่อนด้วยข้อมูล (data-driven insights) และคำแนะนำที่เหมาะสมกับแต่ละบุคคล ผู้ใช้หลักของเรา ได้แก่:

1. **ผู้ใช้กลุ่ม Health-Optimizing (เช่น "ต้น")**: มืออาชีพที่ขับเคลื่อนด้วยข้อมูล (data-driven) ซึ่งต้องการวัดและเพิ่มประสิทธิภาพรูปแบบการนอนของตนเอง เป็นส่วนหนึ่งของกลยุทธ์สุขภาพที่กว้างขึ้น พวกเขาให้ค่ากับการวิเคราะห์ที่ละเอียด การแสดงผลแนวโน้ม และข้อมูลเชิงลึกที่นำไปปฏิบัติได้จริง ซึ่งเชื่อมโยงปัจจัยด้านไลฟ์สไตล์กับคุณภาพการนอน

2. **ผู้ใช้กลุ่ม Sleep-Challenged (เช่น "ปุ๊ก")**: บุคคลที่กำลังเผชิญกับปัญหาการนอน ซึ่งต้องการเข้าใจสาเหตุรากของปัญหาการนอนของตนเอง พวกเขาต้องการคำอธิบายที่ชัดเจน การ coach ที่เหมาะสมกับแต่ละบุคคล และแนวทางแบบไม่ตัดสิน เพื่อปรับปรุง hygiene การนอน

เราเป็นทีมนักศึกษาที่มีประสบการณ์ใน **JavaScript/TypeScript, Python, การพัฒนาเว็บขั้นพื้นฐาน และพื้นฐานฐานข้อมูล** ข้อจำกัดหลักของเรา คือ:

- **กรอบเวลาโปรเจกต์**: หนึ่งภาคเรียน (ประมาณ 12-14 สัปดาห์) ตั้งแต่เริ่มต้นจนถึงการ deploy
- **ขนาดทีม**: ทีมขนาดเล็ก (3-5 คน) ที่มีทักษะในระดับที่แตกต่างกัน
- **เป้าหมายการเรียนรู้**: สมดุลระหว่างการส่งมอบผลิตภัณฑ์ที่ใช้งานได้ กับการเรียนรู้แนวปฏิบัติการพัฒนาสมัยใหม่
- **ข้อจำกัดด้านทรัพยากร**: งบประมาณจำกัด พึ่งพา free tiers ของบริการ cloud เป็นหลัก
- **ความต้องการด้าน Integration**: ต้องเชื่อมต่อกับ external APIs (Apple Health, Google Fit, Google Calendar, ข้อมูลจาก wearable devices)

ระบบต้องจัดการ:
- การยืนยันตัวตนและการจัดการโปรไฟล์ผู้ใช้
- การจัดเก็บและดึงข้อมูลสุขภาพ/การนอนแบบ time-series
- การแสดงผลข้อมูลเชิงภาพ (visualization) และ dashboard
- การสร้าง insights ที่ขับเคลื่อนด้วย AI/ML
- การส่ง push notification และ email
- การ integrations กับ third-party APIs

---

## การตัดสินใจ (Decision)

เราได้ตัดสินใจนำชุดเทคโนโลยีหลักมาใช้ ดังนี้:

| Layer | Technology | Version/เหตุผล |
|-------|-----------|-------------------|
| **Frontend** | **React + Vite** | React 18+ พร้อม Vite สำหรับประสบการณ์การพัฒนาที่รวดเร็ว |
| **Backend** | **Python + Flask** | Flask 3.x พร้อมการออกแบบ RESTful API |
| **Database** | **PostgreSQL 15+** | ฐานข้อมูลแบบ relational พร้อมการรองรับ JSONB |
| **ORM** | **SQLAlchemy 2.0** | ORM ที่รองรับ async สำหรับ Python |
| **AI/Analytics** | **Python + scikit-learn / OpenAI API** | ML library สำหรับการวิเคราะห์ patterns + LLM สำหรับ insights |
| **Authentication** | **JWT (JSON Web Tokens)** | Stateless auth พร้อม refresh token rotation |
| **Deployment (Frontend)** | **Vercel** | Free tier, การ deploy อัตโนมัติจาก Git |
| **Deployment (Backend)** | **Railway หรือ Render** | รองรับ free tier สำหรับ Python backends |
| **Infrastructure** | **Docker Compose** | ความสม่ำเสมอของสภาพแวดล้อมการพัฒนาภายใน |
| **Version Control** | **GitHub** | Repository hosting พร้อม CI/CD ผ่าน GitHub Actions |

### รูปแบบสถาปัตยกรรม (Architecture Pattern)

**Client-Server Architecture พร้อม Separation of Concerns:**

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │  HTTPS  │    Backend      │  SQL    │   Database      │
│   (React/Vite)  │ ──────> │   (Flask/REST)  │ ──────> │  (PostgreSQL)   │
│                 │ <────── │                 │ <────── │                 │
└─────────────────┘  JSON   └────────┬────────┘         └─────────────────┘
                             │
                             │ gRPC/REST
                             ▼
                     ┌─────────────────┐
                     │  AI Service     │
                     │  (Python/ML)    │
                     └─────────────────┘
```

---

## ทางเลือกที่พิจารณา (Options Evaluated)

### ทางเลือก Frontend

| Option | ข้อดี | ข้อเสีย | ผลการตัดสินใจ |
|--------|-------|---------|-----------------|
| **React + Vite (เลือกใช้)** | Ecosystem ขนาดใหญ่, component นำกลับมาใช้ใหม่ได้, HMR รวดเร็ว, ทีมคุ้นเคย, ตลาดแรงงานต้องการสูง | ต้องตั้งค่า routing/state management | ✅ ถูกเลือก |
| Next.js (Full-stack) | SSR/SSG ในตัว, API routes, ทำงานกับ Vercel ได้ดี | Overkill สำหรับ use case แบบ SPA,  learning curve ชันกว่า | ❌ ไม่เลือก |
| Vue.js | Learning curve ที่นุ่มนวลกว่า, เอกสารดีเยี่ยม | Ecosystem เล็กกว่า, ทีมมีประสบการณ์น้อยกว่า | ❌ ไม่เลือก |
| Angular | ระดับ Enterprise, โครงสร้างที่ชัดเจน | หนัก, learning curve ชัน, ความนิยมลดลง | ❌ ไม่เลือก |

### ทางเลือก Backend

| Option | ข้อดี | ข้อเสีย | ผลการตัดสินใจ |
|--------|-------|---------|-----------------|
| **Python + Flask (เลือกใช้)** | ยอดเยี่ยมสำหรับงานด้านข้อมูล/AI, syntax อ่านง่าย, ML ecosystem อุดมสมบูรณ์, ทีมมีประสบการณ์ Python | ช้ากว่า Node.js สำหรับ high-concurrency I/O | ✅ ถูกเลือก |
| Node.js + Express | JavaScript full-stack, I/O รวดเร็ว, เหมาะกับ real-time | การรองรับ ML/AI library แบบ native น้อยกว่า, ความซับซ้อนของ callbacks | ❌ ไม่เลือก |
| FastAPI (Python) | Auto-docs, async-native, performance สูง | Ecosystem ใหม่กว่า, tutorial น้อยกว่า, async learning curve | ❌ ไม่เลือก (แต่เป็นทางเลือกที่ดี) |
| Django (Python) | Batteries-included, admin panel, ORM ในตัว | หนัก, opinionated, overkill สำหรับ API-only | ❌ ไม่เลือก |

### ทางเลือก Database

| Option | ข้อดี | ข้อเสีย | ผลการตัดสินใจ |
|--------|-------|---------|-----------------|
| **PostgreSQL (เลือกใช้)** | ปฏิบัติตาม ACID, JSONB สำหรับความยืดหยุ่น, รองรับ time-series ได้ยอดเยี่ยม, features แบบ relational แข็งแกร่ง | ความซับซ้อนของ horizontal scaling | ✅ ถูกเลือก |
| MongoDB | Schema ยืดหยุ่น, เหมาะกับข้อมูล unstructured | การรับประกัน consistency อ่อนแอกว่า, ไม่จำเป็นสำหรับข้อมูล user/sleep ที่มีโครงสร้าง | ❌ ไม่เลือก |
| SQLite | ไม่ต้อง config, ง่าย | ไม่เหมาะกับ production แบบ multi-user พร้อมกัน | ❌ ไม่เลือก |
| MySQL | ได้รับความนิยม, รองรับดี | น้อยกว่า Postgres ในด้าน features JSON/time-series | ❌ ไม่เลือก |

---

## ผลที่ตามมา (Consequences)

### ผลเชิงบวก (Positive Consequences)

1. **สอดคล้องกับทักษะทีม**: Tech stack ที่เลือก ใช้ประโยชน์จากความรู้ที่มีอยู่ของเราใน JavaScript (frontend) และ Python (backend/AI) ลด learning curve ช่วงเริ่มต้น และให้เราโฟกัสที่ features ของสินค้ามากกว่าการจัดการเครื่องมือ

2. **เส้นทางการผสาน AI/ML ที่แข็งแกร่ง**: การใช้ Python ทั้ง backend และ AI services ทำให้การผสานระหว่าง business logic และ machine learning components เป็นไปอย่างราบรื่น Libraries อย่าง scikit-learn, pandas และ OpenAI Python SDK เป็น first-class citizens ใน ecosystem นี้

3. **ประสบการณ์นักพัฒนาที่ยอดเยี่ยม**: Vite ให้ hot module replacement ที่รวดเร็วระหว่างการพัฒนา frontend ในขณะที่ความเรียบง่ายของ Flask อนุญาตให้ prototype API ได้รวดเร็ว ทั้งสอง frameworks มีเอกสารและการสนับสนุนจาก community ที่กว้างขวาง

4. **รากฐานพร้อม Production**: PostgreSQL ให้ความสมบูรณ์ของข้อมูลระดับ enterprise พร้อม transactions แบบ ACID ซึ่งสำคัญต่อความถูกต้องของข้อมูลสุขภาพ คอลัมน์ JSONB ของมันให้ความยืดหยุ่นสำหรับ data schemas ที่พัฒนาไปโดยไม่ต้อง migrations

5. **การ Deploy ที่คุ้มค่า**: Vercel (frontend) และ Railway/Render (backend) ให้ free tiers ที่กว้างขวาง เหมาะสำหรับโปรเจกต์นักศึกษาและการ validate MVP พร้อมเส้นทางการ scale ที่ตรงไปตรงมา

6. **การแยกความรับผิดชอบที่ชัดเจน**: การแยก React/Flask สร้าง API contracts ที่สะอาด อนุญาตให้พัฒนา frontend/backend ได้อย่างอิสระ และเป็นไปได้ที่จะพัฒนา mobile app ในอนาคตโดยใช้ backend ตัวเดียวกัน

7. **Ecosystem & Community ที่แข็งแกร่ง**: เทคโนโลยีทั้งหมดที่เลือกมี communities ที่ใหญ่และ active รับประกันการสนับสนุนระยะยาว แหล่งเรียนรู้ที่อุดมสมบูรณ์ และการแก้ปัญหาที่ง่าย

8. **คุณค่า Portfolio**: Tech stack นี้แสดงถึงทักษะที่เกี่ยวข้องกับอุตสาหกรรมซึ่งนายจ้างให้ค่าสูง — React สำหรับ frontend, Python สำหรับ backend/data, PostgreSQL สำหรับ databases

### ผลเชิงลบ / สิ่งที่ต้องแลกเปลี่ยน (Trade-offs)

1. **การบำรุงรักษาสองภาษา**: การบำรุงรักษาทั้ง JavaScript (frontend) และ Python (backend) ต้องการ context-switching และ utility functions ซ้ำซ้อน (เช่น การจัดรูปแบบวันที่, validation) วิธีแก้: แบ่งปัน types ผ่าน OpenAPI spec; ใช้ tools อย่าง `openapi-typescript`

2. **ไม่มี Real-time Features ในตัว**: ต่างจาก stacks แบบ WebSocket-native (เช่น Socket.io กับ Node.js), Flask ต้องการ libraries เพิ่มเติม (Flask-SocketIO) สำหรับ real-time updates สำหรับ use case ของเรา (sleep data ไม่ใช่ real-time จริงๆ) polling หรือ SSE เพียงพอแล้ว

3. **ความซับซ้อนของการ Deploy แยก**: การจัดการสอง deployments (Vercel + Railway) เพิ่ม operational overhead เมื่อเทียบกับ monolithic solutions อย่าง Next.js วิธีแก้: GitHub Actions CI/CD automate ทั้งสอง deployments จาก repo เดียว

4. **ข้อจำกัดของ Free Tiers**: 
   - Railway/Render อาจ spin down หลังจากไม่มี activity ("cold starts") ทำให้ response แรกช้า
   - Vercel free tier มีข้อจำกัดเรื่อง build minutes
   - PostgreSQL free tiers มีข้อจำกัดเรื่อง storage/connections
   - วิธีแก้: จดบันทึกข้อจำกัดเหล่านี้; upgrade เมื่อ traffic สมเหตุสมผล

5. **ข้อคิดเรื่อง Scaling**: ลักษณะ synchronous ของ Flask อาจกลายเป็นปัญหาคอขวดภายใต้ concurrent load ที่สูง วิธีแก้: ใช้ async workers (Gevent/Uvicorn), implement caching (Redis เมื่อต้องการ), หรือ migrate ไป FastAPI ภายหลัง

6. **ความซับซ้อนของการตั้งค่าเริ่มต้น**: ต้องการ configuration มากกว่า all-in-one frameworks (เช่น Django, Next.js) วิธีแก้: Docker Compose ให้สภาพแวดล้อม local dev ที่ reproduce ได้; project scaffolding ทำครั้งเดียว

7. **ความซับซ้อนของ State Management**: React ต้องการเลือก solution สำหรับ state management (Context API, Redux, Zustand, Jotai) วิธีแก้: เริ่มต้นด้วย Context API + useReducer; เพิ่ม Zustand หาก complexity เติบโต

---

## หมายเหตุการนำไปใช้งาน (Implementation Notes)

### โครงสร้างโปรเจกต์ (ที่เสนอ)

```
goodnight/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # UI components นำกลับมาใช้ใหม่ได้
│   │   ├── pages/             # Route pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client functions
│   │   ├── store/             # State management
│   │   └── utils/             # Helper functions
│   ├── public/
│   └── package.json
├── backend/                   # Python + Flask
│   ├── app/
│   │   ├── api/               # Route handlers
│   │   ├── models/            # SQLAlchemy models
│   │   ├── services/          # Business logic
│   │   ├── ai/                # ML/AI modules
│   │   ├── utils/             # Helpers
│   │   └── config.py           # Configuration
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── docs/
│   └── architecture/          # ADR นี้อยู่ที่นี่
├── docker-compose.yml
└── README.md
```

### Dependencies หลัก

**Frontend (`package.json`):**
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "axios": "^1.7.0",
    "recharts": "^2.12.0",
    "@tanstack/react-query": "^5.45.0"
  },
  "devDependencies": {
    "vite": "^5.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0"
  }
}
```

**Backend (`requirements.txt`):**
```
flask>=3.0.0
sqlalchemy[asyncio]>=2.0.0
asyncpg>=0.29.0
pydantic>=2.7.0
python-jose[cryptography]>=3.3.0
scikit-learn>=1.5.0
pandas>=2.2.0
openai>=1.35.0
httpx>=0.27.0
pytest>=8.2.0
pytest-asyncio>=0.23.0
```

---

## การตัดสินใจที่เกี่ยวข้อง (Related Decisions)

ADR นี้ให้ข้อมูลและได้รับข้อมูลจาก:
- **ADR-002**: การออกแบบ Database Schema (จะสร้าง)
- **ADR-003**: กลยุทธ์ Authentication (จะสร้าง)
- **ADR-004**: แนวทางการผสาน External APIs (จะสร้าง)

---

## อ้างอิง (References)

1. [C4 Model Documentation](https://c4model.com/)
2. [Vercel Deployment Guide](https://vercel.com/docs)
3. [Railway Python Deployment](https://docs.railway.app/language-guides/python)
4. [Flask Documentation](https://flask.palletsprojects.com/)
5. [React Documentation](https://react.dev/)
6. [PostgreSQL 15 Release Notes](https://www.postgresql.org/docs/15/release-15.html)
