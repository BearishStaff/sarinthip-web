<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sarinthip Web - Coding Rules & Agent Guidelines

เอกสารนี้ระบุกฎ ข้อบังคับ และมาตรฐานการพัฒนาที่ AI Agent และนักพัฒนาต้องปฏิบัติตามอย่างเคร่งครัดในโปรเจกต์ `sarinthip-web`

---

## 🛠 1. ข้อจำกัดทางเทคโนโลยี (Tech Stack & Architecture Constraints)
- **Framework:** Next.js 16 (App Router) + TypeScript
- **CSS:** Tailwind CSS
- **Backend / Database:** Supabase PostgreSQL SDK (Client & Server)
- **PDF Engine:** `@react-pdf/renderer` (จัดการที่ฝั่ง Client)
- **Deployment Platform:** Vercel เท่านั้น
- **ข้อห้ามสำคัญ (Critical Rule):**
  - มีเพียง Next.js และ Supabase เท่านั้นที่ใช้รันและให้บริการเว็บแอปพลิเคชันนี้
  - ห้ามเขียนสคริปต์หรือแนะนำโซลูชันที่ต้องการ Backend Server แยกต่างหาก, การติดตั้ง Docker หรือการใช้ External Services/Database อื่นที่ไม่ใช่ Supabase

---

## 📁 2. โครงสร้างและการจัดวางโค้ด (Code Structure & Directory Conventions)
จัดวาง Logic ของโค้ดตามหน้าที่ของแต่ละไดเรกทอรีอย่างเคร่งครัด:
- **การจัดการข้อมูล / ดึงข้อมูล (Data Services):** ต้องเขียนไว้ที่ `src/services/` เท่านั้น (เช่น `branchService.ts`, `expenseService.ts`)
- **การคำนวณและประมวลผล (Business Logic):** สำหรับการรวมยอด, สรุปยอด, จัดกลุ่มหมวดหมู่ หรือคำนวณสัดส่วนค่า GP ให้จัดวางไว้ใน `src/lib/calculations.ts`
- **ประเภทข้อมูล (Type Definitions):** เขียนและเก็บไว้ที่ `src/types/` (รวมถึงไฟล์ Database Types ที่ดึงจาก Supabase)
- **คอมโพเนนต์ PDF (PDF Layouts):** เทมเพลตและเลย์เอาต์การสร้าง PDF ทั้งหมดต้องเก็บไว้ใต้ `src/components/pdf/`

---

## 💾 3. กฎการจัดการฐานข้อมูลและการ Query (Database & Query Rules)
- **การคัดกรองข้อมูล (Branch-level Isolation):** การดึงข้อมูลรายรับ (`income`) และรายจ่าย (`expenses`) ทุกครั้ง **ต้องมี** เงื่อนไขระบุสาขาด้วย `.eq('branch_id', ...)` เสมอ เพื่อความถูกต้องของการแบ่งแยกสาขา
- **ความแม่นยำของตัวเลข (Numeric Precision):** ตัวเลขที่เป็นประเภท `numeric` (เช่น `amount`, `total_amount`, `qty`, `price_per_unit`) ต้องจัดการและแสดงผลโดยระวังเรื่องค่าทศนิยมและปัญหา Precision เสมอ
- **การบันทึกข้อมูลสัมพันธ์ (Relation Integrity):** ก่อนทำการบันทึกรายจ่าย (`expenses`) ต้องตรวจเช็กให้แน่ใจว่า `bill_id` และ `category_id` ที่ระบุ มีอยู่จริงและถูกต้องตามตารางความสัมพันธ์
- **โครงสร้าง Schema (Schema Namespaces):** ยึดตามชื่อตารางและคอลัมน์ใน `database-schema.sql` โดยปัจจุบันอยู่ใน schema `public` แต่มีแผนการจะย้ายไปยัง schema `branch_management`

---

## 📱 4. มาตรฐานการพัฒนา UI & State
- **Mobile Responsive:** หน้าจอและการควบคุมทั้งหมดต้องได้รับการออกแบบมาให้ใช้งานได้ดีบนอุปกรณ์พกพาเป็นอันดับแรก (Mobile-friendly)
- **การควบคุมสถานะ (State Management):** ใช้ URL Query Parameters ในการเก็บสถานะฟิลเตอร์การเลือกสาขาและเดือน (เช่น `?branchId=...&month=...`) บนแดชบอร์ด เพื่อให้สามารถ Reload หน้าเว็บหรือส่งแชร์ลิงก์ได้โดยที่ฟิลเตอร์ไม่สูญหาย
- **การจัดการฟอร์ม (Form Handling):** แยก Component ของฟอร์มกรอกข้อมูลรายรับ-รายจ่ายให้ชัดเจน และเลือกใช้ Server Actions ในการบันทึกและจัดการการส่งข้อมูลขึ้นฐานข้อมูล

---

## 🖨 5. มาตรฐานการออกเอกสาร PDF (PDF Export Standards)
- **สไตล์และเทมเพลต:**
  - ต้องระบุชื่อสาขา (`branches.name`) และเดือน/ประเภทสรุปที่หัวเอกสาร PDF เสมอ
  - แสดงผลในรูปแบบตาราง A4 ที่สวยงาม โดยระบุคอลัมน์ รายการ, จำนวน, หน่วย, ราคา/หน่วย, และราคารวม
  - แสดงยอดรวมสุทธิไว้ท้ายสุดของตารางสรุปรายจ่ายในหน้าสุดท้าย
- **กฎการจัดหน้า (Pagination Logic):**
  - ในการแบ่งหน้ากระดาษ (Pagination) ให้คำนวณความสูงของตารางและรายการโดยใช้หลักการจัดกลุ่มตามวันที่บันทึก (`entry_date`)
  - **ห้ามปล่อยให้รายการของวันเดียวกันแตกออกไปอยู่คนละหน้าโดยไม่จำเป็น** หากความสูงสะสมรวมกับความสูงของรายการวันนั้นๆ เกินพื้นที่เหลือ ให้ปัดรายการวันนั้นทั้งหมดไปเริ่มต้นที่หน้าใหม่
