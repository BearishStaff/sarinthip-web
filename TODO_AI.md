# Current Progress
- [/] Setup Next.js + Tailwind
- [/] Database Schema (Supabase)
- [/] PDF Generation
- [/] ทำหน้าสำหรับบันทึกรายรับ
- [/] แสดงผลรายรับ รายจ่าย และผลกำไร/ขาดทุนของแต่ละสาขา
- [/] เพิ่ม/ลด สาขาได้
- [ ] แนบรูปโปรไฟล์สาขา แล้วแสดงในหน้าเลือกสาขา
- [ ] แสดงผลกำไรขาดทุนรวมที่หน้าเลือกสาขาได้

# Critical Notes
- [/] pdf ใบรับรองแทนใบเสร็จ แสดงวันที่ไม่เรียงกัน (แก้ไขแล้ว)
- [/] pdf ใบรับรองแทนใบเสร็จควรขึ้นหน้าใหม่หากมีรายการที่ต้องในวันนั้นๆไม่สามารถแสดงครบในหน้าเดียว เช่น แสดงวันที่ 1, 2, 3 แล้ววันที่ 3 มีรายการ 5 รายการ แต่ไม่สามารถเอาทั้ง 5 รายการแสดงต่อในหน้าเดิมได้จนต้องขึ้นหน้าใหม่ ให้เอารายการของวันที่ 3 ทั้งหมดขึ้นหน้าใหม่ได้เลย (แก้ไขแล้ว)
- [/] วันที่ expense ไม่ตรงกับตอนที่กรอก expense เช่นกรอก วันที่ 30/04/2026 แต่ save ใน database เป็น 01/05/2026 (แก้ไขแล้ว - แก้ timezone issue ใน convertThaiDateToISO function)
- [ ] ย้ายทุก table ออกจาก schema `public` ไปยัง schema `branch_management`
  - **เหตุผล**: Supabase มีแนวทางที่จะจำกัดการเข้าถึง schema `public` ผ่าน Data API (PostgREST) เพื่อความปลอดภัยและเป็นแนวทางปฏิบัติที่ดี จึงควรย้าย table ของแอปไปไว้ใน schema เฉพาะ
  - **ขั้นตอนที่ USER ต้องช่วยทำ (ผ่าน Supabase Dashboard)**:
    1. รัน SQL สคริปต์ (ที่ AI เตรียมให้) ใน SQL Editor เพื่อสร้าง schema `branch_management`, ย้าย tables ต่างๆ (branches, categories, bills, income, expenses) เข้าไป, และกำหนดสิทธิ์ (Grants) ให้ `anon` และ `authenticated` role
    2. เข้าไปที่ **Settings > API > API Settings > Exposed schemas** ใน Supabase Dashboard แล้วติ๊กเลือก `branch_management` เพิ่มเติม เพื่อให้เรียกผ่าน API ได้
  - **ขั้นตอนที่ AI จะช่วยทำให้ในโปรเจกต์นี้ (ให้ USER สั่งต่อได้เลย)**:
    1. [ ] เตรียม **SQL Script** ในการสร้าง schema, ย้ายตาราง, อัปเดต foreign keys, และอัปเดต Role/Permissions ให้ USER นำไปรัน
    2. [ ] แก้ไขไฟล์อ้างอิง `database-schema.sql` ในโปรเจกต์ให้เปลี่ยนเป็น schema `branch_management`
    3. [ ] แก้ไขโค้ดฝั่ง Client/Server ทั้งหมดที่เรียกใช้ Supabase ให้ชี้ไปที่ schema `branch_management` แทนค่าเริ่มต้น (เช่น การเพิ่ม `.schema('branch_management')` หรือตั้งค่า global)
    4. [ ] หากโปรเจกต์มีการ generate Database types จาก Supabase CLI, AI จะเตรียมคำสั่งสำหรับดึง Type definitions ใหม่ให้ตรงกับ schema ที่เปลี่ยนไป