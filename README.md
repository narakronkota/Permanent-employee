📋 Employee Contact Management System (Full-Stack)
ระบบจัดการข้อมูลและเงินเดือนพนักงานแบบ Full-Stack ที่รองรับการทำงานบนระบบ Cloud สมบูรณ์แบบ

🚀 Live Demo
Backend: https://emolyee-contact.onrender.com

Frontend: (https://emolyee-contact-mrbl.vercel.app/)

✨ Features
Authentication: ระบบ Login/Logout สำหรับ Admin พร้อมระบบ Verify ตัวตนผ่าน Middleware

Dashboard Summary: แสดงผลสรุปจำนวนพนักงานทั้งหมดและผลรวมเงินเดือนแบบ Real-time โดยใช้ SQL Aggregation

Employee Management: ระบบ CRUD (Create, Read, Update, Delete) ข้อมูลพนักงาน

Cloud Profile Image: อัปโหลดและจัดการรูปโปรไฟล์ผ่าน Cloudinary

Responsive Dashboard: รองรับ




🛠 Tech Stack
Frontend: React.js, Tailwind CSS, Lucide React (Icons), Axios

Backend: Node.js, Express.js

Database: MySQL (Hosted on Aiven Cloud)

Image Hosting: Cloudinary API

Deployment: Render

💡 Key Technical Challenges (สิ่งที่ผมได้เรียนรู้)
Cloud Migration: การย้ายฐานข้อมูลจาก Local ไปยัง Aiven Cloud และการจัดการ Connection String ให้มีความปลอดภัย

State Management: การใช้ React Hooks (useState, useEffect) และ localStorage เพื่อจัดการข้อมูล User และรูปภาพโปรไฟล์ให้คงอยู่แม้มีการ Refresh หน้าจอ

Error Handling: การจัดการ Error จาก API และการแจ้งเตือนผู้ใช้งานผ่าน SweetAlert2


🔧 Installation & Setup
Clone โปรเจกต์: git clone ...

ติดตั้ง Dependencies: npm install

ตั้งค่า Environment Variables (.env) สำหรับ DB และ Cloudinary

รันโปรเจกต์: npm run dev
