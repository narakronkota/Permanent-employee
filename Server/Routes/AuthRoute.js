import express from 'express';
import con from '../utils/db.js'; // อย่าลืมแก้ path ให้ตรงกับไฟล์เชื่อม DB ของพี่
import jwt from 'jsonwebtoken';
import { verifyAdmin } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// ⚡️ สายไฟเส้นที่ 1: Login
router.post('/adminlogin', (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const sql = "SELECT * FROM admin WHERE email = ?";

    con.query(sql, [email], (err, result) => {
        if (err) return res.json({ loginStatus: false });
        if (result.length > 0) {
            if (result[0].password === password) {
                const token = jwt.sign(
                    { role: "admin", email: email },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "1d" }
                );
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,      // ต้องเป็น true เพราะใช้ https บน Render
                    sameSite: 'none',   // สำคัญที่สุด: เพื่อให้ Cookie ส่งข้ามโดเมนได้
                    maxAge: 3600000    // อายุ 1 ชั่วโมง
                });
                return res.json({ loginStatus: true });
            } else {
                return res.json({ loginStatus: false, Error: "Wrong password" });
            }
        } else {
            return res.json({ loginStatus: false, Error: "Email not found" });
        }
    });
});

// ⚡️ สายไฟเส้นที่ 2: Verify (ตัวนี้ย้ายมาไว้ที่นี่ได้ เพราะเกี่ยวกับสิทธิ์ Admin)
router.get('/verify', (req, res) => {
    return res.json({ Status: true, email: req.email, role: req.role });
});

export default router; // 📤 ส่งออก Router ไปให้ server.js ใช้