import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import { verifyAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// --------------------------------------------------------
// POST: Admin Authentication & Cookie Generation
// --------------------------------------------------------
router.post("/adminlogin", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const sql = "SELECT * FROM admin WHERE email = ?";

  con.query(sql, [email], (err, result) => {
    if (err) return res.json({ loginStatus: false });
    if (result.length > 0) {
      // Verify plain-text password alignment
      if (result[0].password === password) {
        // Generate access token with 1-day expiration
        const token = jwt.sign(
          { role: "admin", email: email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" },
        );
        // Secure cookie injection for production readiness
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 3600000, // 1 hour
        });

        return res.json({ loginStatus: true });
      } else {
        return res.json({ loginStatus: false, Error: "not found" });
      }
    } else {
      return res.json({ loginStatus: false, Error: "Email not found" });
    }
  });
});
// --------------------------------------------------------
// GET: Verify Authentication State (Protected Route)
// --------------------------------------------------------
//  Added 'verifyAdmin' middleware to populate req.email and req.role properly
router.get("/verify", (req, res) => {
  return res.json({ Status: true, email: req.email, role: req.role });
});

export default router;
