# C4 Level 1 — System Context: Good Night

เอกสารนี้แสดงขอบเขตของระบบ Good Night ในระดับระบบ (system context) ตามเกณฑ์ Lab 5 โดยเน้นผู้ใช้หลัก ระบบภายนอก และการไหลของข้อมูลที่จำเป็นต่อ Sleep Tracking & Optimization

## Scope

- ผู้ใช้หลักคือ ต้น (Health-Optimizing) และปุ๊ก (Sleep-Challenged)
- ความสามารถหลักในภาคเรียนนี้คือ manual sleep log, quality rating, behavioral tags และ dashboard/trend
- การ sync จาก wearable แบบ real-time เป็น future integration และไม่อยู่ใน core scope ของเทอมนี้

## Diagram

```mermaid
C4Context
    title System Context diagram for Good Night

    Person(ton, "ต้น (Ton)", "ผู้ใช้แบบ Health-Optimizing ที่ต้องการดู trend และปรับปรุงการนอน")
    Person(pook, "ปุ๊ก (Pook)", "ผู้ใช้แบบ Sleep-Challenged ที่ต้องการเข้าใจสาเหตุและรับคำแนะนำ")

    System(goodnight, "Good Night", "Web platform สำหรับบันทึก วิเคราะห์ และปรับปรุงคุณภาพการนอน")

    System_Ext(health_api, "Wearable / Health API", "แหล่งข้อมูลสุขภาพภายนอกสำหรับการเชื่อมต่อในอนาคต")
    System_Ext(notification, "Notification Service", "บริการส่ง bedtime reminder หรือสรุปรายสัปดาห์")
    System_Ext(calendar, "Calendar API", "บริการปฏิทินสำหรับการวางแผนกิจวัตรก่อนนอน")

    Rel(ton, goodnight, "บันทึก sleep log ดู dashboard และอ่าน trend", "HTTPS")
    Rel(pook, goodnight, "บันทึกปัญหาการนอน ดู insight และรับคำแนะนำ", "HTTPS")
    Rel(goodnight, health_api, "นำเข้าข้อมูลสุขภาพเมื่อเปิดใช้ integration", "HTTPS/JSON")
    Rel(goodnight, notification, "ส่งการแจ้งเตือนเมื่อเปิดใช้ฟีเจอร์", "HTTPS")
    Rel(goodnight, calendar, "สร้างกิจกรรมการนอนเมื่อเปิดใช้ฟีเจอร์", "HTTPS")
```

## Context decisions

Good Night เป็นระบบหลักที่ควบคุมข้อมูลการนอนของผู้ใช้และเป็นเจ้าของ user flow ส่วนระบบภายนอกเป็น integration boundary ไม่ใช่แหล่งตัดสินใจแทนระบบหลัก การแยก boundary นี้ช่วยให้ทีมพัฒนา core manual logging ได้ก่อน โดยยังรองรับการต่อยอด health data, notification และ calendar ในภายหลัง

