import express from 'express';
import con from '../utils/db.js'; 
import jwt from 'jsonwebtoken';
import { verifyAdmin } from '../middleware/AuthMiddleware.js';

const router = express.Router();


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
                    secure: true,      
                    sameSite: 'none',  
                    maxAge: 3600000   
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

router.get('/verify', (req, res) => {
    return res.json({ Status: true, email: req.email, role: req.role });
});

export default router; 
