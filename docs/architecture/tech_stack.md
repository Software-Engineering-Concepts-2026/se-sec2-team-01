# Tech Stack — Good Night

เอกสารนี้สรุป technology choice สำหรับ scope ของ Good Night โดยผูกเหตุผลกับ persona, user stories, NFR, ขนาดทีม และเป้าหมายการ deploy ไม่ใช่เลือกจากความคุ้นเคยเพียงอย่างเดียว

## Context ที่ใช้ตัดสินใจ

- ภาคเรียนนี้เน้น core web dashboard, manual sleep log และการวิเคราะห์ trend
- ผู้ใช้ต้องเห็นข้อมูลของตนเองอย่างปลอดภัย จึงต้องมี authentication, authorization และ data integrity
- ทีมมีขนาดเล็กและต้อง demo end-to-end ภายในเวลาจำกัด จึงให้ความสำคัญกับ setup และ deployment ที่ทำซ้ำได้
- ใช้ free tier เป็นหลัก และยังไม่ทำ real-time wearable synchronization เป็น core feature

## Selected stack

| Layer | Choice | Context-based rationale | Alternative |
| --- | --- | --- | --- |
| Frontend | React + Vite + TypeScript | เหมาะกับ dashboard ที่ประกอบด้วย reusable components และพัฒนา/preview ได้เร็วใน Sprint | Vue + Vite, Next.js |
| UI and charts | Tailwind CSS + Recharts/D3.js | ช่วยทำ responsive dashboard และกราฟ trend โดยไม่ต้องสร้าง visualization engine เอง | CSS Modules, Chart.js |
| Backend API | Python 3.11+ + Flask 3.x | REST API มีขอบเขตชัด เชื่อมกับงาน data/analytics ได้ง่าย และพอสำหรับ core scope | FastAPI, Node.js + Express |
| API contract | REST + OpenAPI 3.0 | Web App เรียกใช้งานได้ตรงไปตรงมา และช่วยให้ acceptance criteria/NFR ตรวจสอบ endpoint ได้ | GraphQL, gRPC |
| Database | PostgreSQL 15+ | รองรับ relational integrity ของ users/records และ JSONB สำหรับ metadata หรือ tags ที่อาจเพิ่มภายหลัง | MySQL, MongoDB |
| ORM and validation | SQLAlchemy 2.0 + Pydantic 2 | แยก persistence model จาก validation และลดความเสี่ยงข้อมูล sleep record ผิดรูปแบบ | Raw SQL, Marshmallow |
| Insight and analytics | Python + pandas + scikit-learn; OpenAI API เป็น optional adapter | เหมาะกับ trend, correlation และคำอธิบายที่ต้องตรวจสอบได้ โดยไม่บังคับให้ทุก flow พึ่ง LLM | Rules only, separate ML platform |
| Authentication | JWT access token + refresh-token rotation | รองรับ web client แบบ stateless และวาง authorization boundary ก่อนอ่านข้อมูลสุขภาพส่วนบุคคล | Server session, OAuth2 |
| Hosting | Vercel (frontend) + Render/Railway (backend) | แยก deploy ตาม C4 boundary และเริ่มจาก free tier ได้โดยไม่ต้องดูแล server เอง | AWS ECS, Fly.io |
| Local infrastructure | Docker Compose | ทำให้ทีมใช้ environment ใกล้เคียงกันและเตรียมต่อยอด service/database ได้ | ติดตั้ง dependency บนเครื่องโดยตรง |
| Version control and CI | GitHub + GitHub Actions | สอดคล้องกับ PR workflow ของรายวิชาและเปิดทางให้ตรวจ test/build อัตโนมัติ | GitLab CI, Bitbucket |

## Trade-offs and boundaries

- เลือก Flask แทน full-stack framework เพื่อให้ core API เล็กและชัด แต่ทีมต้องกำหนด validation, auth และ project structure เอง
- เลือก PostgreSQL แม้ setup หนักกว่า SQLite เพราะ data integrity และ query สำหรับ trend สำคัญกว่า convenience ระยะสั้น
- แยก Insight Service เป็น boundary ใน C4 แต่ยังไม่บังคับให้เป็น microservice เต็มรูปแบบจนกว่าจะมี NFR/traffic ที่พิสูจน์ว่าควรแยก deploy
- OpenAI API เป็น optional adapter; ระบบต้องไม่เปิดเผยข้อมูลส่วนบุคคลเกินความจำเป็น และควรมี deterministic analysis สำหรับ core acceptance criteria
- Redis, real-time wearable sync และ deployment แบบ multi-region ยังเป็น future decisions ไม่ใช่ commitment ของ Milestone นี้

