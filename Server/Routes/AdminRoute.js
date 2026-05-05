import express from "express";
import con from "../utils/db.js"
import jwt from "jsonwebtoken";
import { upload } from '../middleware/CloudinaryConfig.js';
import { verifyAdmin } from '../middleware/AuthMiddleware.js';


const router = express.Router()


// 2. เพิ่ม upload.single('image') เข้าไปใน router.post
router.post('/add_employee', upload.single('image'), (req, res) => {

    // ลองเช็คข้อมูลที่ถูกส่งมา
    console.log("DATA:", req.body);
    console.log("FILE:", req.file); // ถ้าสำเร็จ req.file.path จะเป็น URL ของรูป

    // 3. แก้ไข SQL ให้เพิ่มคอลัมน์ image และเพิ่มเครื่องหมาย ? อีก 1 ตัว
    const sql = `                                
        INSERT INTO addem (name, email, password, salary, address, category, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // 4. เพิ่ม req.file.path เข้าไปในอาเรย์ values (ลำดับสุดท้าย)
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.salary,
        req.body.address,
        req.body.category,
        req.file ? req.file.path : null // ถ้ามีการเลือกรูป ให้เอา URL จาก Cloudinary มาใส่
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.log("❌ ERROR:", err);
            return res.json({ Status: false, Error: err });
        }
        console.log("✅ INSERT OK (With Cloudinary Image):", result);
        return res.json({ Status: true });
    });
});

router.get('/employee', (req, res)  => {

    //  SQL สำหรับดึงข้อมูลพนักงานทั้งหมด  เอามาโชว์หน้า profile 
    const sql = "SELECT * FROM addem";

    //  ยิงคำสั่ง SQL ไปที่ MySQL
    con.query(sql, (err, result) => {

        //  ถ้ามี error เช่น table ผิด / DB ล่ม
        if (err) return res.json({ Status: false });

        //  ถ้าสำเร็จ
        return res.json({
            Status: true,     // บอกว่า success
            Result: result    // 🔥 ข้อมูลทั้งหมดจาก database
        });
    });

});

// --- API สำหรับสรุปตัวเลขหน้า Dashboard ---
router.get('/dashboard_summary', verifyAdmin, (req, res) => {
    // 1. ใส่ชื่อตารางให้ครบ 
    // 2. ใช้คำสั่งนับและรวมในบรรทัดเดียว (ถ้ามาจากตาราง addem เหมือนกัน)
    const sql = `
        SELECT 
            COUNT(id) AS totalEmployee, 
            SUM(salary) AS totalSalary 
        FROM addem
    `;

    con.query(sql, (err, result) => {
        if (err) {
            console.log("❌ Summary Error:", err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        
        // ส่งผลลัพธ์แถวแรกกลับไป
        return res.json({
            Status: true,
            Result: result[0] 
        });
    });
});



// --- 1. API สำหรับดึงข้อมูลพนักงาน "รายคน" มาโชว์ในฟอร์มแก้ไข ---
router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM addem WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
    })
})
////api ดึงงพนักงานมาเเก้ไขใน table 
router.put('/edit_employee/:id', verifyAdmin, (req, res) => {
    const id = req.params.id;
    // 1. เพิ่ม password เข้ามาใน destructuring
    const { name, email, password, salary, address, category } = req.body;

    const sql = `UPDATE addem 
                 SET name = ?, email = ?, password = ?, salary = ?, address = ?, category = ? 
                 WHERE id = ?`;

    // 2. ใส่ password ลงใน array และเรียงลำดับให้ตรงกับ SQL ด้านบน
    const values = [name, email, password, salary, address, category, id];

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    })
})

// --- API สำหรับลบข้อมูลพนักงาน ---
router.delete('/delete_employee/:id', verifyAdmin, (req, res) =>  {
    const id = req.params.id; // ดึง id จาก URL
    const sql = "DELETE FROM addem WHERE id = ?";

    con.query(sql, [id], (err, result) => {
        if (err) {
            console.log("❌ Delete Error:", err);
            return res.json({ Status: false, Error: err });
        }
        // ถ้าลบสำเร็จ
        return res.json({ Status: true, Result: result });
    });
});

router.delete('/delete_employee/:id', (req, res) => {
    // 1. ดึง ID จาก URL Parameters (เช่น /delete_employee/1)
    const id = req.params.id;

    // 2. คำสั่ง SQL สำหรับลบข้อมูล
    const sql = "DELETE FROM addem WHERE id = ?";

    // 3. ทำการส่ง ID เข้าไปในคำสั่ง SQL
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.log("❌ Delete Error:", err);
            return res.json({ 
                Status: false, 
                Error: "Query Error: " + err.message 
            });
        }

        // ✅ ถ้าลบสำเร็จ จะส่ง Status true กลับไป
        return res.json({ 
            Status: true, 
            Result: result 
        });
    });
});

export default router