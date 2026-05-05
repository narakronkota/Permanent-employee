import express from 'express';
import { upload } from '../middleware/CloudinaryConfig.js';
import con from '../utils/db.js';
import { v2 as cloudinary } from 'cloudinary';
const router = express.Router();

//  ใช้ POST สำหรับอัปโหลดรูปโปรไฟล์ (ไม่ทับกับ admin เพราะ path ต่างกัน)
router.post('/upload_avatar', upload.single('image'), (req, res) => {
    const imageUrl = req.file.path; // URL ที่ได้จาก Cloudinary
    const adminId = req.body.id;    // ส่ง ID มาว่าคนไหนจะเปลี่ยนรูป

    // อัปเดต URL รูปใหม่ลงในตาราง admin (หรือตารางที่คุณใช้เก็บข้อมูล admin)
    const sql = "UPDATE admin SET image = ? WHERE id = ?";
    
    con.query(sql, [imageUrl, adminId], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ 
            Status: true, 
            Result: imageUrl // ส่ง URL กลับไปให้ Frontend โชว์รูปทันที
        });
    });
});

//  ดึงข้อมูล Admin (รวมถึง URL รูปภาพ) ตาม ID
router.get('/admin_details/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT id, email, image FROM admin WHERE id = ?";
    
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ 
            Status: true, 
            Result: result // จะได้ข้อมูลออกมาเป็น Array (เช่น result[0].image)
        });
    });
});

router.delete('/delete_avatar/:id', (req, res) => {
  const id = req.params.id;

  // 1. ดึง URL รูปเดิมมาเพื่อหา Public ID
  const sqlSelect = "SELECT image FROM admin WHERE id = ?";
  con.query(sqlSelect, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });

    if (result.length > 0 && result[0].image) {
      const imageUrl = result[0].image;

      if (imageUrl.includes('cloudinary')) {
        const urlParts = imageUrl.split('/');
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExt.split('.')[0];
        
        // ตรวจสอบชื่อ Folder ให้ตรงกับตอนที่ Upload นะครับ
        const publicId = `employee_images/${fileName}`;

        // 2. ลบใน Cloudinary
        cloudinary.uploader.destroy(publicId, (cloudErr, cloudRes) => {
          if (cloudErr) console.error("Cloudinary Error:", cloudErr);
          console.log("Cloudinary Result:", cloudRes);
        });
      }
    }

    // 3. สำคัญ: ลบชื่อไฟล์ใน Database ออกด้วย (เซ็ตเป็น NULL หรือค่าว่าง)
    const sqlUpdate = "UPDATE admin SET image = NULL WHERE id = ?";
    con.query(sqlUpdate, [id], (updateErr) => {
      if (updateErr) return res.json({ Status: false, Error: "Update DB Error" });
      
      return res.json({ Status: true, Message: "ลบรูปภาพเรียบร้อยแล้ว" });
    });
  });
});
export default router;