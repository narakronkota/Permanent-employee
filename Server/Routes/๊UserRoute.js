import express from 'express';
import { upload } from '../middleware/CloudinaryConfig.js';
import con from '../utils/db.js';
import { v2 as cloudinary } from 'cloudinary';
const router = express.Router();

router.post('/upload_avatar', upload.single('image'), (req, res) => {
    const imageUrl = req.file.path; 
    const adminId = req.body.id;    


    const sql = "UPDATE admin SET image = ? WHERE id = ?";
    
    con.query(sql, [imageUrl, adminId], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ 
            Status: true, 
            Result: imageUrl 
        });
    });
});


router.get('/admin_details/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT id, email, image FROM admin WHERE id = ?";
    
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ 
            Status: true, 
            Result: result 
        });
    });
});

router.delete('/delete_avatar/:id', (req, res) => {
  const id = req.params.id;

  const sqlSelect = "SELECT image FROM admin WHERE id = ?";
  con.query(sqlSelect, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });

    if (result.length > 0 && result[0].image) {
      const imageUrl = result[0].image;

      if (imageUrl.includes('cloudinary')) {
        const urlParts = imageUrl.split('/');
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExt.split('.')[0];
        

        const publicId = `employee_images/${fileName}`;


        cloudinary.uploader.destroy(publicId, (cloudErr, cloudRes) => {
          if (cloudErr) console.error("Cloudinary Error:", cloudErr);
          console.log("Cloudinary Result:", cloudRes);
        });
      }
    }


    const sqlUpdate = "UPDATE admin SET image = NULL WHERE id = ?";
    con.query(sqlUpdate, [id], (updateErr) => {
      if (updateErr) return res.json({ Status: false, Error: "Update DB Error" });
      
      return res.json({ Status: true, Message: "ลบรูปภาพเรียบร้อยแล้ว" });
    });
  });
});
export default router;