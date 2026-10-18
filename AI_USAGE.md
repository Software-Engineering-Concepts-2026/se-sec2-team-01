# AI Usage Disclosure

เอกสารนี้เป็นการเปิดเผยการใช้ AI ในระดับทีมสำหรับโปรเจกต์ **Good Night** ไม่ได้จำกัดเฉพาะสมาชิกคนใดคนหนึ่ง

## Lab 1 — First Pragmatic Commit Usage

### Tools and tasks

- ทีมใช้ ChatGPT/Codex ช่วยจัดโครงสร้างเอกสาร Lab 1 ให้ครบ Identification, Pragmatic Promise, เหตุผลที่อยากเรียน Software Engineering และ Broken Window
- ใช้ AI ช่วยตรวจ checklist ของ deliverables และตรวจว่าความยาวเอกสารของสมาชิกอยู่ในช่วง 200–500 คำ
- ใช้ AI ช่วยเสนอ wording ภาษาไทย ตรวจความชัดเจนของข้อความ และจัดรูปแบบ Markdown ให้สม่ำเสมอในไฟล์ `team/*.md`

### Example prompts

1. “ช่วยตรวจว่าไฟล์ Lab 1 มี Identification, Pragmatic Promise, เหตุผลที่อยากเรียน SE และ Broken Window ครบหรือไม่”
2. “ช่วยปรับโครงสร้างข้อความให้เป็น Markdown และมีความยาวตามเกณฑ์ 200–500 คำ โดยคงประสบการณ์ของผู้เขียนไว้”
3. “ช่วยตรวจภาษาและความชัดเจนของ Pragmatic Promise โดยเน้นพฤติกรรมที่ทำได้จริง เช่น branch, commit, review และการแจ้ง blocker”

### Team verification and responsibility

- ทีมเป็นผู้ตัดสินใจเนื้อหา เป้าหมาย และวิธีทำงานร่วมกัน AI ทำหน้าที่เป็นผู้ช่วยด้านโครงสร้าง checklist และภาษาเท่านั้น
- สมาชิกแต่ละคนเป็นผู้ให้ข้อมูลและรับผิดชอบตรวจสอบไฟล์ส่วนตัวของตนเอง เช่น ชื่อเล่น ประสบการณ์ Broken Window และ Pragmatic Promise ก่อน merge
- ทีมตรวจและปรับข้อความที่ AI เสนอให้ตรงกับบริบทของ Good Night และประสบการณ์จริงของสมาชิก ไม่ส่งข้อความที่ยังไม่ได้อ่านหรือทำความเข้าใจ
- ไม่ใช้ AI ตัดสินใจแทนทีม และไม่ใช้ข้อมูลส่วนตัวของสมาชิกคนอื่น ข้อมูลบัญชี รหัสผ่าน หรือ secret ใน prompt

## Lab 2 — Project Proposal and User Personas Usage

### งานที่ทีมใช้ AI ช่วย

- ใช้ ChatGPT ช่วยร่าง project proposal โดยให้ AI รวบรวมข้อมูลจากความเห็นของทีม เกี่ยวกับเธมที่เลือก (The Quantified Self Dashboard) และให้เป็นเอกสารเดียวที่มีโครงสร้าง
- ใช้ AI ช่วยพัฒนารายละเอียด 2 personas (Ton — Health-Optimizing User และ Pook — Sleep-Challenged User) โดยให้ AI ขยายชีวประวัติ, งาน, ปัญหา, ความต้องการ จากข้อมูลเบื้องต้นที่ทีมให้
- ใช้ AI ช่วยจัดรูปแบบ MoSCoW priorities ให้ชัดเจนและมีตรรกะ โดยอ้างอิงกับ value proposition ของทีม
- ใช้ AI ช่วยระบุและเขียน Risks & Assumptions ให้สมบูรณ์ เช่น สมมติฐานว่าผู้ใช้มีวินัยในการบันทึกข้อมูล และความเสี่ยงเรื่อง high friction หรือ data inaccuracy

### ตัวอย่างการใช้กับงานของทีม

1. ให้ AI ร่าง project proposal skeleton โดยให้ AI ข้อมูล: ชื่อโปรเจกต์ = "Good Night", theme = "Quantified Self Dashboard", 2 personas = Ton และ Pook, value prop = "help users understand root cause of sleep quality through data visualization" แล้วให้ AI ขยายเป็น proposal เต็มรูปแบบ
2. ให้ AI ช่วยพัฒนา Ton persona โดยเล่าให้ AI ฟังว่า "Ton อายุ 34, Product Manager ที่ FinTech, ต้องการ preventive optimization เพราะประวัติครอบครัว" แล้วให้ AI เขียน bio, job context, education/knowledge context ที่ยาวพอและตรงกับบริบท
3. ให้ AI ช่วยขยาย Pook persona โดยบอก "Pook อายุ 34, Senior Marketing Manager, มีปัญหานอนไม่หลับที่เพิ่มขึ้นเมื่อเลื่อนตำแหน่ง, มีปัญหา high friction กับแอป tracking ปัจจุบัน" แล้วให้ AI เขียนรายละเอียดที่เชื่อมกับปัญหาจริง
4. ให้ AI ช่วยจัดรูป MoSCoW ให้มีเหตุผล: Must = sleep log + dashboard, Should = activity tagging, Could = bedtime reminder, Won't = real-time wearable sync

### การตรวจสอบและความรับผิดชอบของทีม

- ทีมเป็นผู้เลือกเธมจาก 4 theme ที่ให้มา และเป็นผู้ตัดสินใจ persona ทั้งสาระและเชิงลึก (มีปัญหาแบบไหน, อายุเท่าไร, อาชีพอะไร, motivation ตรงไหน)
- ทีมตรวจเนื้อหาที่ AI ร่างว่าตรงกับ decision ของทีมจริงไหม เช่น ตรวจว่า Ton bio ที่ AI ช่วยเขียน ไม่ได้สร้างรายละเอียดปลอมขึ้นใหม่ แต่เป็นการขยายจากข้อเท็จจริงที่ทีมเล่า
- AI ช่วยเรื่องการเรียบเรียง formatting และ completeness checklist เท่านั้น ไม่ได้ตัดสินใจ value proposition, scope priorities หรือสมมติฐานแทนทีม
- ทีมตรวจ MoSCoW priorities ว่าตรงกับ value prop ที่ทีมเลือกจริงไหม และตรวจ Risks ว่าเป็นความเสี่ยงจริงของทีมหรือแค่ generic risks
- ไม่ส่งรหัสนิสิต ข้อมูลส่วนตัว ที่อยู่ หรือ contact info ของสมาชิกทีมเข้าไปใน prompt แม้ว่า personas เป็นสมมติฐาน

## Lab 3 — การใช้ AI กับ Requirements ของ Good Night

### งานที่ทีมใช้ AI ช่วย

- ใช้ AI ช่วยรวบรวมข้อมูลจาก persona เดิมของต้นและปุ๊กให้เป็นเอกสารเดียว โดยคงรายละเอียดจาก source เดิมและทำเครื่องหมายข้อมูลที่ยังต้อง validate
- ใช้ AI ช่วยแตกเหตุการณ์จากการใช้งานจริงของโปรเจกต์ เช่น ต้นดู dashboard ตอนเช้า เปรียบเทียบพฤติกรรมรายสัปดาห์ และปุ๊กบันทึกคืนที่ทำงานดึก
- ใช้ AI ช่วยตรวจว่าแต่ละ scenario เชื่อมกับ user story ใด และช่วยจัดรูปแบบ story, acceptance criteria และ issue reference ให้อ่านต่อได้ง่าย
- ใช้ AI ช่วยเสนอวิธีเขียน NFR ของ dashboard, insight และการเก็บข้อมูลให้มีเกณฑ์วัดผลและวิธีทดสอบที่ชัดเจน

### ตัวอย่างการใช้กับงานของทีม

1. ให้ AI ตรวจข้อมูล persona ของต้นและปุ๊กเทียบกับไฟล์ต้นทาง แล้วระบุเฉพาะส่วนที่ขาดหรือเป็น assumption โดยไม่ให้เติมประวัติส่วนตัวขึ้นเอง
2. ให้ AI ช่วยตรวจว่า SC-T03 และ SC-P02 นำไปสู่ story เรื่องการเปรียบเทียบ tag กับคุณภาพการนอนได้ครบทั้ง happy path และกรณีข้อมูลไม่พอหรือไม่
3. ให้ AI ช่วยทบทวนเกณฑ์ของ dashboard และ recommendation เช่น p95 response time, จำนวน records ที่รองรับ และ test coverage ว่าสามารถทดสอบได้จริงหรือไม่

### การตรวจสอบและความรับผิดชอบของทีม

- ทีมเป็นผู้เลือกใช้ persona เดิม 2 คน คือ ต้นและปุ๊ก และเป็นผู้ตัดสินใจ scope, ลำดับ Must/Should, estimate รวมถึงตัวเลขเป้าหมายของ NFR
- ทีมตรวจเนื้อหาที่ AI ช่วยร่างกับ Project Proposal, persona ต้นทาง, scenario และโค้ด/โครงสร้าง repository ก่อนนำไปใช้ในเอกสาร
- AI ช่วยเรื่องการเรียบเรียงและตรวจความครบถ้วนเท่านั้น ไม่ได้ยืนยันว่า NFR ผ่านการทดสอบหรือเลือก requirement แทนทีม
- ส่วน Education ที่ไม่มีข้อมูลใน persona ต้นทางถูกระบุเป็นข้อมูลที่ต้อง validate แทนการเดาหรือเติมรายละเอียดของบุคคล
- ไม่ส่งรหัสนิสิต ข้อมูลบัญชี คะแนนจริง รหัสผ่าน หรือ secret เข้าไปใน prompt

## Lab 4 — Rapid Prototyping with AI Usage

### Tools and tasks

- ทีมใช้ GitHub Copilot/ChatGPT ช่วยสร้าง HTML form skeleton สำหรับ sleep goal setup prototype
- ใช้ AI ช่วยเสนอวิธีเขียน CSS styling เช่น flexbox, dark theme variables, layout patterns
- ใช้ AI ช่วยเสนอ JavaScript logic สำหรับ tab switching, localStorage, form handling
- ใช้ AI ช่วยตรวจว่า prototype UI flow ครบถ้วนและสามารถเชื่อมกับ user story ได้

### Example prompts

1. "สร้าง HTML form สำหรับการตั้งค่าเป้าหมายการนอน โดยมี dropdown อายุ, time picker, activity checkboxes และ submit button"
2. "ช่วยออกแบบ CSS layout สำหรับ dashboard sidebar navigation + topbar + main content โดยใช้ flexbox และ dark theme colors"
3. "สร้าง JavaScript function สำหรับ tab switching โดยใช้ addEventListener เมื่อคลิก tab button ให้ element เปลี่ยน class"

### ส่วนที่รับจาก AI

**Adisak (Sleep Goal Setup):**
- AI generate: HTML form skeleton ทั้งหมด พร้อม input types, labels, button
- AI generate: CSS styling เช่น container, section, label, input styling
- AI generate: JavaScript localStorage.setItem/getItem สำหรับบันทึกข้อมูล

**Danudet (Health Tracking):**
- AI generate: HTML form structure + tab buttons + history table template
- AI generate: CSS card layout, table styling, tab active state styling
- AI generate: JavaScript tab switching logic + form submission handler

**Rungrawi (Dashboard):**
- AI generate: Sidebar navigation HTML structure พร้อม buttons
- AI generate: CSS dark theme variables + sidebar styling + card layout
- AI generate: JavaScript greeting logic, stat display, chart rendering

### Team verification and responsibility

- ทีมใช้ AI เพื่อช่วยเร็วขึ้นเท่านั้น ไม่ได้เขียน code เอง
- ทีมตรวจสอบ code ที่ AI generate ว่ารันได้จริงในเบราว์เซอร์
- ทีมทดสอบ interactive behavior ทั้ง 3 prototype (form submit, tab switching, localStorage)
- ไม่ใช้ AI ตัดสินใจเลือก feature/scope — ทีมกำหนด scope จาก Lab 3 user stories
- ไม่ส่งข้อมูลส่วนตัว รหัสนิสิต password หรือ secret เข้าไปใน prompt
- ทีมรู้ว่า prototype คือ PROTOTYPE (ทิ้งได้) ที่จะ discard หลัง feedback แล้วเขียน production code ใหม่ใน Sprint 2

### งานที่ทีมใช้ AI ช่วย

- ใช้ AI ช่วยรวบรวมข้อมูลจาก persona เดิมของต้นและปุ๊กให้เป็นเอกสารเดียว โดยคงรายละเอียดจาก source เดิมและทำเครื่องหมายข้อมูลที่ยังต้อง validate
- ใช้ AI ช่วยแตกเหตุการณ์จากการใช้งานจริงของโปรเจกต์ เช่น ต้นดู dashboard ตอนเช้า เปรียบเทียบพฤติกรรมรายสัปดาห์ และปุ๊กบันทึกคืนที่ทำงานดึก
- ใช้ AI ช่วยตรวจว่าแต่ละ scenario เชื่อมกับ user story ใด และช่วยจัดรูปแบบ story, acceptance criteria และ issue reference ให้อ่านต่อได้ง่าย
- ใช้ AI ช่วยเสนอวิธีเขียน NFR ของ dashboard, insight และการเก็บข้อมูลให้มีเกณฑ์วัดผลและวิธีทดสอบที่ชัดเจน

### ตัวอย่างการใช้กับงานของทีม

1. ให้ AI ตรวจข้อมูล persona ของต้นและปุ๊กเทียบกับไฟล์ต้นทาง แล้วระบุเฉพาะส่วนที่ขาดหรือเป็น assumption โดยไม่ให้เติมประวัติส่วนตัวขึ้นเอง
2. ให้ AI ช่วยตรวจว่า SC-T03 และ SC-P02 นำไปสู่ story เรื่องการเปรียบเทียบ tag กับคุณภาพการนอนได้ครบทั้ง happy path และกรณีข้อมูลไม่พอหรือไม่
3. ให้ AI ช่วยทบทวนเกณฑ์ของ dashboard และ recommendation เช่น p95 response time, จำนวน records ที่รองรับ และ test coverage ว่าสามารถทดสอบได้จริงหรือไม่

### การตรวจสอบและความรับผิดชอบของทีม

- ทีมเป็นผู้เลือกใช้ persona เดิม 2 คน คือ ต้นและปุ๊ก และเป็นผู้ตัดสินใจ scope, ลำดับ Must/Should, estimate รวมถึงตัวเลขเป้าหมายของ NFR
- ทีมตรวจเนื้อหาที่ AI ช่วยร่างกับ Project Proposal, persona ต้นทาง, scenario และโค้ด/โครงสร้าง repository ก่อนนำไปใช้ในเอกสาร
- AI ช่วยเรื่องการเรียบเรียงและตรวจความครบถ้วนเท่านั้น ไม่ได้ยืนยันว่า NFR ผ่านการทดสอบหรือเลือก requirement แทนทีม
- ส่วน Education ที่ไม่มีข้อมูลใน persona ต้นทางถูกระบุเป็นข้อมูลที่ต้อง validate แทนการเดาหรือเติมรายละเอียดของบุคคล
- ไม่ส่งรหัสนิสิต ข้อมูลบัญชี คะแนนจริง รหัสผ่าน หรือ secret เข้าไปใน prompt

## Lab 5 — การใช้ AI กับ Architectural Artifacts ของ Good Night

### งานที่ทีมใช้ AI ช่วย

- ใช้ ChatGPT/Codex ช่วยร่างโครง Mermaid สำหรับ C4 Level 1 และ Level 2 แล้วตรวจให้ชื่อผู้ใช้, external system, container และ edge สอดคล้องกับ Good Night
- ใช้ AI ช่วยจัดตาราง tech stack ให้มี layer, rationale และ alternative ครบตาม rubric โดยผูกเหตุผลกับ manual sleep log, dashboard, NFR และข้อจำกัดของทีม
- ใช้ AI ช่วยตั้งคำถาม challenge ADR เช่น operational overhead, data boundary, deployment trade-off และเงื่อนไขที่ควรแยก Insight Service ในอนาคต
- ใช้ AI ช่วยตรวจความเชื่อมโยงระหว่าง C4, ADR, Project Proposal และ user stories ก่อนเตรียมส่ง PR

### ตัวอย่าง prompts ที่ทีมใช้

1. “ช่วยร่าง C4Context และ C4Container แบบ Mermaid สำหรับ Good Night โดยมีต้น ปุ๊ก Web App, Backend API, Insight Service, PostgreSQL และ external integrations พร้อม label ของทุก edge”
2. “ช่วยตรวจ tech stack ของระบบ sleep dashboard ว่าแต่ละ layer มี rationale เชิง context และ alternative หรือยัง โดยอย่าเลือก technology แทนทีม”
3. “ช่วย challenge ADR ที่เลือก modular monolith และแยก Insight Service boundary ว่ามี consequence, operational risk และเงื่อนไขการเปลี่ยนสถาปัตยกรรมอะไรที่ควรบันทึก”

### ส่วนที่รับจาก AI และการตรวจสอบ

- AI ช่วยเสนอ Mermaid syntax skeleton, รูปแบบตาราง และคำถามสำหรับ challenge ADR เป็น draft เท่านั้น
- ไม่มีส่วนตัดสินใจด้าน architecture ที่ทีมรับจาก AI แบบไม่แก้ ทีมเป็นผู้เลือก boundary, technology, alternative และ trade-off แล้วปรับถ้อยคำให้ตรงกับ Proposal, persona และ repository จริง
- ทีมต้องตรวจ Mermaid ให้ render ได้และต้องอธิบายได้ทุก component/relationship ก่อน merge; AI ไม่ได้ยืนยันผลการ render หรือความถูกต้องของ implementation แทนทีม

### Team verification and responsibility

- ทีมเป็นผู้ตัดสินใจเลือก React + Vite, Flask, PostgreSQL, JWT, Docker Compose และแนวทาง modular monolith; AI ไม่มีสิทธิ์ตัดสินใจแทน
- สมาชิกตรวจว่า C4 ไม่สัญญา feature ที่อยู่นอก scope เช่น real-time wearable sync และตรวจว่า optional integration ถูกระบุเป็น future boundary
- ทีมตรวจ rationale กับ NFR เรื่อง authorization, data integrity, response time และ deployment ก่อนนำไปใช้ในเอกสาร
- ไม่ส่งรหัสนิสิต ข้อมูลผู้ใช้จริง token รหัสผ่าน หรือ secret เข้าไปใน prompt

## Lab 6 — First Container Usage

### งานที่ทีมใช้ AI ช่วย

- ใช้ ChatGPT/Codex ช่วยเสนอ skeleton ของ Dockerfile สำหรับ `stats-service` ที่ใช้ Python/FastAPI, slim base image, multi-stage build, non-root user และ port `8000`
- ใช้ AI ช่วยอธิบายหน้าที่ของแต่ละ layer และช่วยตรวจว่าการ build จาก repository root คัดลอกเฉพาะ `requirements.txt` กับ `app.py` ที่จำเป็น
- ใช้ AI ช่วยทบทวนรายการ `.dockerignore`, คำสั่ง build/run, port mapping และ trade-off ระหว่าง Container กับ VM

### ตัวอย่าง prompts ที่ทีมใช้

1. “ช่วยร่าง Dockerfile แบบ multi-stage สำหรับ Python FastAPI โดยใช้ `python:3.12-slim`, ติดตั้ง dependency ใน builder stage, รันด้วย non-root user และเปิด port 8000”
2. “ช่วยตรวจว่า root Dockerfile ที่ copy service จาก `services/stats-service` มีความเสี่ยงเรื่อง secret, tests, cache หรือไฟล์ที่ไม่จำเป็นใน image หรือไม่”
3. “ช่วยอธิบายวิธีตรวจ `/` และ `/health`, image size และ user ที่ container ใช้งาน หลังจาก `docker run`”

### ส่วนที่รับจาก AI และการตรวจสอบ

- AI ช่วยเสนอรูปแบบ multi-stage, virtual environment, `.dockerignore` และคำสั่งตรวจสอบเป็น draft
- ทีมเป็นผู้เลือก `stats-service`, Python 3.12, port 8000, tag `v0.1.0` และขอบเขตไฟล์ที่ให้เข้า image
- ทีมต้อง build และ run ด้วย Docker จริง ตรวจ HTTP response และบันทึก image size ก่อนระบุผลใน PR

### Team verification and responsibility

- ทีมตรวจ Dockerfile ทุกบรรทัดกับ source จริง ไม่คัดลอก `.env`, token, password หรือข้อมูลผู้ใช้เข้า image
- ทีมต้องยืนยันว่า runtime ใช้ user `nobody`, endpoint ตอบ 2xx, image size ไม่เกิน 500 MB และ registry เป็น public ตามเกณฑ์
- AI ไม่ได้ยืนยันผล build, registry หรือ security scan แทนทีม และจะไม่รายงานผลดังกล่าวจนกว่าจะทดสอบจริง

## Lab 7 — Refactoring Milestone 1 Usage

### เครื่องมือที่ใช้ (Tools Used)
* **AI Tools:** ChatGPT / Codex

### งานที่ทีมใช้ AI ช่วย
- ใช้ ChatGPT / Codex ช่วยอ่านโค้ดใน `services/stats-service/app.py` และวิเคราะห์ Code Smell ด้าน Poor/Vague Naming และ Inline response construction / Mixed responsibility
- ใช้ ChatGPT / Codex ช่วยเสนอชื่อ Route Handlers แบบ Role-focused (`service_info`, `health_check`) ตามหลัก Pragmatic Programmer Tip 74
- ใช้ ChatGPT / Codex ช่วยเสนอการสกัดฟังก์ชัน Response Payload (`get_service_info_payload`, `get_health_payload`) เพื่อแยกความรับผิดชอบและเพิ่ม Testability
- ใช้ ChatGPT / Codex ช่วยร่าง Contract Tests ใน `services/stats-service/tests/test_app.py` ตามลำดับ Workflow: Explain -> Propose -> Apply -> Test เพื่อป้องกัน Regression

### รายการ 3 Prompts สำคัญที่ทีมใช้
1. *"อ่าน FastAPI service นี้แล้วระบุ code smell ด้าน naming และ endpoint responsibility พร้อมเหตุผล"*
2. *"เสนอชื่อฟังก์ชันที่สื่อความหมายกว่า root และ health โดยคง HTTP contract เดิม"*
3. *"ช่วยเสนอ test cases สำหรับตรวจว่า endpoint / และ /health ยังคืน status และ JSON เดิมหลัง refactor"*

### ส่วนที่รับจาก AI และการตรวจสอบของทีม
- AI ช่วยอธิบาย smell, เสนอชื่อ handler และโครงสร้างของ contract tests เป็น draft ทางเลือก
- ทีมเป็นผู้ตัดสินใจเลือกแนวทาง Refactor ขนาดเล็ก ไม่เพิ่ม abstraction หรือ pattern เกินจำเป็น และคงความเข้ากันได้ของ API Contract เดิม 100%
- ทีมเป็นผู้เขียนและรันชุดทดสอบด้วย `pytest` ในเครื่องจริง โดยยืนยันผลการทดสอบผ่าน 2 passed

### Team verification and responsibility
- **ทีมยืนยันว่าสมาชิกในทีมเป็นผู้ตรวจสอบ คิด วิเคราะห์ และเขียน/แก้ไขโค้ดและเอกสารเองมากกว่า 70% (ทีมรับผิดชอบ >= 70%)**
- **ทีมไม่มีการส่งหรือหลุดของ Secret, Token, Password หรือข้อมูลระบุตัวตนบุคคลจริงลงใน Prompt หรือ Repository อย่างเด็ดขาด**

## Lab 9 — Unit Test, TDD, Property-Based Testing และ CI

### เครื่องมือและงานที่ AI ช่วย

- ใช้ ChatGPT/Codex ช่วยตรวจสถานะ repository ล่าสุดเทียบ Step 1–5 และ rubric ก่อนเริ่มแก้
- ใช้ AI ช่วยเสนอกรณีทดสอบ `calculate_discount` สำหรับ amount และ percentage หลาย partition/boundary รวมถึง properties ที่ตรวจผลลัพธ์จริง ไม่ตรวจเพียงว่าโค้ดถูกเรียก
- ใช้ AI ช่วยร่าง Hypothesis tests, GitHub Actions workflow และรูปแบบบันทึก Saboteur โดยปรับ path และคำสั่งให้เข้ากับโครงสร้าง repository
- ใช้ AI ช่วยจัดโครงสร้างเอกสาร AI usage และบันทึกผลการทดสอบ Lab 9 จากหลักฐานที่ตรวจได้

### ตัวอย่าง prompts สำหรับงาน Lab 9 (เรียบเรียงจากงานที่ทำ)

1. “ช่วยออกแบบ unit tests ให้ `calculate_discount` ครอบคลุม happy path, boundary ที่ 0% และ 100%, จำนวนเงินเป็นศูนย์/ติดลบ และเปอร์เซ็นต์ที่ไม่ถูกต้อง โดย assert ผลลัพธ์หรือ exception จริง ไม่ใช้แค่การตรวจว่าเรียกฟังก์ชันแล้ว”
2. “ช่วยเสนอ property-based tests ด้วย Hypothesis สำหรับ invariant ของส่วนลด เช่น 0% ต้องคืนยอดเดิม, 100% ต้องได้ศูนย์ และเปอร์เซ็นต์ที่สูงขึ้นต้องไม่ทำให้ยอดสุทธิเพิ่มขึ้น พร้อมตรวจว่ากรณีทดสอบจับการเปลี่ยนเงื่อนไข boundary แบบ Saboteur ได้”
3. “ตรวจ repository เทียบกับ Step 1–5 และ rubric ของ Lab 9 โดยเช็กตำแหน่งไฟล์, unit/property tests, Saboteur evidence, coverage และ GitHub Actions; ทำเฉพาะส่วนที่ยังขาดใน branch ปัจจุบันและอย่า push”

### ส่วนที่ AI ช่วยร่างและการตรวจสอบ

- AI ช่วยร่าง tests, workflow และข้อความเอกสาร; มีการปรับชื่อไฟล์และ path ให้ตรงกับ rubric และตรวจ assertions ว่ายืนยันค่าผลลัพธ์/exception ของ `calculate_discount` จริง
- Hypothesis พบกรณี `NaN` ที่ validation เดิมยอมให้ผ่าน จึงเพิ่มการปฏิเสธค่าที่ไม่ finite หลังยืนยันด้วย test ที่ล้มก่อนแก้และผ่านหลังแก้
- การทดสอบ Saboteur เปลี่ยนขอบเขตชั่วคราวจาก `percentage > 100` เป็น `percentage >= 100`; unit test และ property test ล้มเหลวตามคาด แล้วคืนโค้ดและรันทดสอบซ้ำ
- การ sabotage ถูกทดสอบในเครื่องเท่านั้นและไม่ได้ push โค้ดที่จงใจ break; หลัง push โค้ดที่คืนสภาพแล้ว ยังไม่ได้ตรวจยืนยันผล GitHub Actions, branch protection หรือ badge ใน PR description

### Team verification and responsibility

- ทีมต้องทบทวนว่า business rule ให้ปฏิเสธ `NaN`/infinity และ properties ที่เลือกตรงกับกติกาของโครงการก่อน merge
- ทีมต้องยืนยัน workflow บน GitHub ว่า run ทั้ง push และ pull request, ตั้ง required status check ให้ block merge และแนบ badge ใน PR description; AI ไม่ได้ยืนยันการตั้งค่า GitHub แทนทีม
- AI เป็นผู้ช่วยตรวจและร่างเท่านั้น ทีมรับผิดชอบการตัดสินใจ domain rule, การตรวจผลจริง และการอนุมัติงาน
- ไม่ส่ง secret, token, password หรือข้อมูลส่วนบุคคลจริงเข้า prompt

## Lab 15 — Final Reflection and Demo Day Usage

### งานที่ใช้ AI ช่วยในช่วงสรุปโปรเจกต์

- ใช้ ChatGPT/Codex ช่วยอ่านเกณฑ์ Lab 15 แล้วจัดหัวข้อ reflection ให้ตอบครบทั้ง 8 คำถาม พร้อมตรวจตำแหน่งไฟล์และหลักฐานที่ควรอ้าง
- ใช้ AI ช่วยสรุปบริบทจากไฟล์ใน repository, ADR 0002, PR #60 และ merge commit เพื่อให้การเล่าเรื่องเชื่อมกับสิ่งที่ส่งมอบจริง
- ใช้ AI ช่วยเรียบเรียงภาษาไทยและปรับโครงสร้างคำตอบให้อ่านเป็นเรื่องเดียวกัน โดยใช้เป็น draft ไม่ใช่แหล่งยืนยันข้อเท็จจริง
- ระหว่างทำ Good Night ใช้ AI เป็นคู่คิดสำหรับการอธิบาย Sleep Score, พฤติกรรมการนอน, การออกแบบคำแนะนำ, การเชื่อม Supabase และการวิเคราะห์ปัญหาจากหน้าจอหรือข้อความ error

### ตัวอย่างคำสั่งที่ใช้ (ถอดความเพื่อสรุป ไม่ใช่ prompt verbatim)

1. “ตรวจ repository และ PR เทียบกับ rubric แล้วชี้ว่าหลักฐานหรือ deliverable ส่วนไหนยังขาด”
2. “อธิบายว่า Sleep Score ใช้ข้อมูลอะไร และคาเฟอีน/การออกกำลังกายควรมีบทบาทในคำแนะนำอย่างไร โดยแยกข้อเท็จจริงออกจากข้อเสนอ”
3. “ช่วยเรียบเรียง Final Reflection ให้ตอบครบ 8 ข้อ พร้อมผูกกับ PR, commit และการตัดสินใจใน ADR”

### สิ่งที่รับจาก AI และการตรวจสอบของผู้พัฒนา

- AI ช่วยเสนอ outline, ถ้อยคำ, checklist และแนวทางตรวจสอบ; ผู้พัฒนาเป็นผู้เลือกเนื้อหา แก้ wording และรับผิดชอบคำตอบที่ส่ง
- ข้ออ้างเกี่ยวกับ implementation อ้างอิง source/ADR ใน repository ส่วนสถานะ PR อ้างอิง PR #60 และ merge commit `a2436d0`; ไม่แต่งจำนวน test ที่ผ่านหรือผล deploy ขึ้นใหม่จากคำตอบของ AI
- การวิเคราะห์สาเหตุจาก error เป็นเพียงสมมติฐานจนกว่าจะตรวจ configuration, response และ log จริง เช่น ข้อความเกี่ยวกับการสมัครบัญชีไม่ควรสรุปจาก toggle หรือ screenshot จุดเดียว
- AI ช่วยสร้างหรือปรับ code/document drafts ได้ แต่ผู้พัฒนาต้องตรวจ diff และทดสอบ flow ที่เกี่ยวข้องก่อนยืนยันว่าใช้งานได้
- เอกสารนี้ไม่บันทึกค่า API key, password, token หรือ secret; ค่าที่ต้องใช้จริงควรอยู่ใน environment variables หรือ secret store ที่เหมาะสม ไม่อยู่ในไฟล์ที่เผยแพร่
