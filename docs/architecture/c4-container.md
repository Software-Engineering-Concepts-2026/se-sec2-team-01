# C4 Level 2 — Container Diagram: Good Night

เอกสารนี้ซูมจาก system context เข้ามาที่ container หลักของ Good Night โดยระบุ technology label และ protocol ของทุกความสัมพันธ์ที่สำคัญ

## Diagram

```mermaid
C4Container
    title Container diagram for Good Night

    Person(ton, "ต้น (Ton)", "ผู้ใช้ที่ติดตาม trend และปรับปรุงสุขภาพ")
    Person(pook, "ปุ๊ก (Pook)", "ผู้ใช้ที่ต้องการวิเคราะห์ปัญหาการนอน")

    System_Ext(health_api, "Wearable / Health API", "ข้อมูลสุขภาพภายนอก")
    System_Ext(notification, "Notification Service", "บริการแจ้งเตือน")
    System_Ext(calendar, "Calendar API", "บริการปฏิทิน")

    System_Boundary(goodnight, "Good Night") {
        Container(web, "Web App", "React + Vite", "หน้าจอ sleep log, rating, tags และ dashboard")
        Container(api, "Backend API", "Python + Flask", "จัดการ authentication, sleep records และ REST endpoints")
        Container(insights, "Insight Service", "Python + scikit-learn / OpenAI API", "คำนวณ trend และสร้าง insight ที่อธิบายได้")
        ContainerDb(db, "Sleep Database", "PostgreSQL 15+", "เก็บ users, sleep records, ratings, tags และ metrics")
    }

    Rel(ton, web, "ใช้งานผ่าน browser", "HTTPS")
    Rel(pook, web, "ใช้งานผ่าน browser", "HTTPS")
    Rel(web, api, "เรียกใช้ REST API", "HTTPS/JSON")
    Rel(api, db, "อ่านและบันทึกข้อมูล", "SQL")
    Rel(api, insights, "ขอวิเคราะห์ trend และปัจจัย", "REST/JSON")
    Rel(insights, db, "อ่าน sleep records และ metrics", "SQL read-only")
    Rel(api, health_api, "นำเข้าข้อมูลเมื่อผู้ใช้อนุญาต", "HTTPS/JSON")
    Rel(api, notification, "ส่ง reminder เมื่อเปิดใช้ฟีเจอร์", "HTTPS")
    Rel(api, calendar, "สร้างกิจกรรมการนอนเมื่อเปิดใช้ฟีเจอร์", "HTTPS")
```

## Container responsibilities

| Container | Responsibility | Boundary ที่ต้องรักษา |
| --- | --- | --- |
| Web App | รับ input และแสดงผล sleep log, rating, tags และ dashboard | ไม่เข้าถึงฐานข้อมูลโดยตรง |
| Backend API | authentication, authorization, validation และ business rules | เป็นจุดเดียวที่รับคำขอจาก Web App |
| Insight Service | คำนวณ trend และสร้างคำอธิบายจากข้อมูลที่ผ่านการอนุญาต | อ่านข้อมูลตามขอบเขต ไม่เขียนข้อมูลผู้ใช้โดยตรง |
| Sleep Database | เก็บข้อมูลผู้ใช้และ sleep records | แยกสิทธิ์การเข้าถึงและรักษา data integrity |

การกำหนด container แบบนี้ทำให้ core flow ยังเข้าใจง่ายสำหรับทีมเล็ก แต่มี service boundary สำหรับ analytics ซึ่งสามารถแยก deploy หรือ scale เพิ่มได้เมื่อมีหลักฐานจาก NFR และภาระงานจริง

