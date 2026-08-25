# User Stories — Good Night

User stories ชุดนี้ derive จาก scenarios ใน `scenarios.md` และใช้ persona 2 คนเดิม โดย Issue reference ชี้ไปยัง backlog ที่มีอยู่ใน repository

## US-01 ตั้งเป้าหมายการนอนและสร้าง baseline

**Source scenario:** SC-T01, SC-P01<br>
**Issue reference:** [#29](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/29)<br>
**Persona:** ต้น / ปุ๊ก

As a user, I want to set my target sleep duration and preferred bedtime, so that Good Night can compare my records with a personal baseline.

**Acceptance Criteria**

- Given ผู้ใช้กรอก target duration และ preferred bedtime แล้ว When กดยืนยัน Then ระบบต้องบันทึกค่าได้
- Given ผู้ใช้ไม่เลือก activity tag บางรายการ When ยืนยัน onboarding Then ระบบต้องยังเริ่มใช้งานได้
- Given ผู้ใช้เปิด onboarding ซ้ำ When มี baseline อยู่แล้ว Then ระบบต้องไม่สร้าง profile ซ้ำโดยไม่แจ้งผู้ใช้

**Priority:** Must<br>
**Estimate:** M

## US-02 สมัครบัญชีด้วยอีเมลและรหัสผ่าน

**Source scenario:** SC-T01, SC-P01<br>
**Issue reference:** [#7](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/7)<br>
**Persona:** ต้น / ปุ๊ก

As a user, I want to register with an email and password, so that my sleep history is stored in my own account.

**Acceptance Criteria**

- Given อีเมลมีรูปแบบถูกต้องและรหัสผ่านผ่าน policy When กดสมัคร Then ระบบต้องสร้างบัญชีสำเร็จ
- Given อีเมลถูกใช้แล้ว When กดสมัคร Then ระบบต้องแจ้งว่าไม่สามารถใช้ซ้ำและไม่สร้างบัญชีใหม่
- Given รหัสผ่านไม่ผ่าน policy When กดสมัคร Then ระบบต้องแสดงข้อผิดพลาดที่แก้ไขได้โดยไม่แสดงรหัสผ่านเป็น plain text

**Priority:** Must<br>
**Estimate:** M

## US-03 เข้าสู่ระบบและเห็นเฉพาะข้อมูลของตนเอง

**Source scenario:** SC-T01, SC-P01<br>
**Issue reference:** [#8](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/8)<br>
**Persona:** ต้น / ปุ๊ก

As a user, I want to sign in securely, so that only I can access my personal sleep records.

**Acceptance Criteria**

- Given credentials ถูกต้อง When กด sign in Then ระบบต้องพาไปหน้า dashboard ของบัญชีตนเอง
- Given credentials ผิด When กด sign in Then ระบบต้องแจ้งข้อผิดพลาดทั่วไปโดยไม่บอกว่าอีเมลหรือรหัสผ่านส่วนใดผิด
- Given ผู้ใช้ร้องขอข้อมูลของบัญชีอื่น When ระบบตรวจสิทธิ์ Then ระบบต้องปฏิเสธคำขอ

**Priority:** Must<br>
**Estimate:** M

## US-04 เริ่มบันทึกเวลานอน

**Source scenario:** SC-T01, SC-P01<br>
**Issue reference:** [#9](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/9)<br>
**Persona:** ต้น / ปุ๊ก

As a user, I want to start a sleep session, so that I do not have to remember my bedtime manually.

**Acceptance Criteria**

- Given ไม่มี active sleep session When กดเริ่มนอน Then ระบบต้องบันทึก timestamp ของการเริ่ม session
- Given มี active sleep session อยู่แล้ว When กดเริ่มซ้ำ Then ระบบต้องไม่สร้าง session ซ้ำและต้องบอกสถานะปัจจุบัน
- Given ผู้ใช้เปิดหน้าจอใหม่ระหว่าง session When กลับมา Then ระบบต้องแสดง session เดิมให้ทำต่อได้

**Priority:** Must<br>
**Estimate:** M

## US-05 หยุดและบันทึก sleep record อัตโนมัติ

**Source scenario:** SC-P01<br>
**Issue reference:** [#12](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/12)<br>
**Persona:** ปุ๊ก / ต้น

As a user, I want my sleep record to be saved after I stop the session, so that my history is not lost and duration is calculated for me.

**Acceptance Criteria**

- Given มี active session When กดตื่น Then ระบบต้องคำนวณ duration และบันทึก record สำเร็จ
- Given เวลาเข้านอนอยู่ก่อนเที่ยงคืนและเวลาตื่นอยู่วันถัดไป When คำนวณ duration Then ระบบต้องได้ค่าข้ามวันถูกต้อง
- Given ข้อมูลสำคัญไม่ครบ When กดบันทึก Then ระบบต้องแจ้ง field ที่ต้องแก้และไม่สร้าง record ที่ไม่สมบูรณ์

**Priority:** Must<br>
**Estimate:** M

## US-06 ให้คะแนนและบันทึกความรู้สึกหลังตื่น

**Source scenario:** SC-P01, SC-P02<br>
**Issue reference:** [#14](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/14)<br>
**Persona:** ปุ๊ก / ต้น

As a user, I want to rate how I feel after waking up, so that the system can compare subjective feeling with sleep duration and quality.

**Acceptance Criteria**

- Given ผู้ใช้เลือก rating 1–5 When บันทึก Then ระบบต้องเก็บ rating คู่กับวันที่ของ sleep record
- Given ผู้ใช้เลือก mood/feeling When บันทึก Then ระบบต้องแสดงค่าที่เลือกในรายละเอียดของคืน
- Given ผู้ใช้ยังไม่เลือก rating When กดบันทึก Then ระบบต้องแจ้งว่าเป็นข้อมูลที่ต้องกรอกหรืออนุญาตให้ข้ามตามกติกาที่ทีมกำหนดอย่างชัดเจน

**Priority:** Should<br>
**Estimate:** S

## US-07 ติดแท็กพฤติกรรมและปัจจัยก่อนนอน

**Source scenario:** SC-T03, SC-P02<br>
**Issue reference:** [#15](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/15)<br>
**Persona:** ต้น / ปุ๊ก

As a user, I want to tag caffeine, stress, exercise and screen time, so that I can compare behaviours with sleep quality.

**Acceptance Criteria**

- Given ผู้ใช้เลือกได้หลาย tag When บันทึก Then ระบบต้องเก็บ tag ทั้งหมดกับคืนที่เกี่ยวข้อง
- Given ผู้ใช้ไม่มีปัจจัยใด When บันทึก Then ระบบต้องรองรับสถานะ “ไม่มีปัจจัยที่เลือก” โดยไม่สร้าง tag ปลอม
- Given ผู้ใช้เปิด history When เลือกคืนใด Then ระบบต้องเห็น tags ที่เคยบันทึกและแก้ไขได้ตามสิทธิ์

**Priority:** Should<br>
**Estimate:** M

## US-08 ดู dashboard และ trend การนอน

**Source scenario:** SC-T02, SC-P02, SC-P04<br>
**Issue reference:** [#23](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/23)<br>
**Persona:** ต้น / ปุ๊ก

As a user, I want to see my sleep score, duration and weekly trend, so that I can understand my sleep pattern quickly.

**Acceptance Criteria**

- Given มี sleep records อย่างน้อย 1 คืน When เปิด dashboard Then ระบบต้องแสดง summary ล่าสุดและจำนวน records ที่ใช้คำนวณ
- Given มีข้อมูลหลายคืน When เปิด weekly view Then ระบบต้องแสดง trend และเปิดดูรายละเอียดของแต่ละคืนได้
- Given มีข้อมูลน้อยหรือไม่มีข้อมูล When เปิด dashboard Then ระบบต้องแสดง empty state และไม่แสดง trend ที่ทำให้เข้าใจว่าเป็นข้อสรุปที่น่าเชื่อถือ

**Priority:** Must<br>
**Estimate:** L

## US-09 วิเคราะห์ความสัมพันธ์ระหว่างปัจจัยกับคุณภาพการนอน

**Source scenario:** SC-T03, SC-P02, SC-P04<br>
**Issue reference:** [#24](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/24)<br>
**Persona:** ต้น / ปุ๊ก

As a user, I want to compare sleep quality across behaviour tags, so that I can identify patterns worth testing in my routine.

**Acceptance Criteria**

- Given มี records ที่มีและไม่มี tag เดียวกัน When เปิด analysis Then ระบบต้องแสดงจำนวน records และค่าที่เปรียบเทียบ
- Given ข้อมูลของกลุ่มใดน้อยเกินไป When สร้างผลวิเคราะห์ Then ระบบต้องระบุว่า data is insufficient แทนการฟันธง
- Given ผู้ใช้เปิด insight When ดูรายละเอียด Then ระบบต้อง link กลับไปยัง records ที่ใช้คำนวณได้

**Priority:** Should<br>
**Estimate:** L

## US-10 รับคำแนะนำเฉพาะบุคคลแบบอธิบายได้

**Source scenario:** SC-T04, SC-P03<br>
**Issue reference:** [#26](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/issues/26)<br>
**Persona:** ต้น / ปุ๊ก

As a user, I want a concise recommendation based on my logged patterns, so that I can try one practical change without feeling judged.

**Acceptance Criteria**

- Given มี pattern และ records เพียงพอ When เปิด recommendation Then ระบบต้องแสดง action ที่ทำได้จริงพร้อมเหตุผล
- Given ยังไม่มีหลักฐานเพียงพอ When เปิด recommendation Then ระบบต้องบอกว่ายังสรุปไม่ได้และแนะนำให้เก็บข้อมูลต่อ
- Given ผู้ใช้ปิดหรือเลื่อน notification When ระบบจะส่งคำแนะนำซ้ำ Then ระบบต้องเคารพ preference และไม่แจ้งถี่เกินกติกาที่กำหนด

**Priority:** Should<br>
**Estimate:** L
