import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        // ถ้าไม่มี Token ไม่ต้องส่ง Status: true/false อย่างเดียว
        // ส่งข้อความบอก Error ไปด้วยจะได้รู้ว่าหลุดเพราะอะไร
        return res.json({ Status: false, Error: "ไม่มี Token กรุณา Login" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({ Status: false, Error: "Token ไม่ถูกต้อง หรือหมดอายุ" });
        } else {
            // ✨ จุดสำคัญ: เก็บข้อมูลที่แกะจาก Token ไว้ใน req
            // เพื่อให้ฟังก์ชันถัดไป (เช่น การเพิ่มพนักงาน) เอาไปใช้ต่อได้
            req.email = decoded.email;
            req.role = decoded.role;
            
            next(); //  ประตูเปิด! ให้ไปทำงานที่ฟังก์ชันถัดไปได้
        }
    });
};