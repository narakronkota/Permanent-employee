import express from "express";
import con from "../utils/db.js"
import jwt from "jsonwebtoken";
import { upload } from '../middleware/CloudinaryConfig.js';
import { verifyAdmin } from '../middleware/AuthMiddleware.js';


const router = express.Router()


// --------------------------------------------------------
// POST: Add new employee with Cloudinary image upload
// --------------------------------------------------------
router.post('/add_employee', upload.single('image'), (req, res) => {

    console.log("DATA:", req.body);
    console.log("FILE:", req.file); 

    
    const sql = `                                
        INSERT INTO addem (name, email, password, salary, address, category, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.salary,
        req.body.address,
        req.body.category,
        req.file ? req.file.path : null 
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

// --------------------------------------------------------
// GET: Fetch all employees
// --------------------------------------------------------
router.get('/employee', (req, res)  => {

   
    const sql = "SELECT * FROM addem";

   
    con.query(sql, (err, result) => {

        if (err) return res.json({ Status: false });

       
        return res.json({
            Status: true,     
            Result: result    
        });
    });

});

// --------------------------------------------------------
// GET: Fetch dashboard summary metrics (Admin Only)
// --------------------------------------------------------
router.get('/dashboard_summary', verifyAdmin, (req, res) => {
    
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
        
    
        return res.json({
            Status: true,
            Result: result[0] 
        });
    });
});

// --------------------------------------------------------
// GET: Fetch a specific employee by ID
// --------------------------------------------------------

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM addem WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
    })
})

// --------------------------------------------------------
// PUT: Update employee details (Admin Only)
// -------------------------------------------------------
router.put('/edit_employee/:id', verifyAdmin, (req, res) => {
    const id = req.params.id;

    const { name, email, password, salary, address, category } = req.body;

    const sql = `UPDATE addem 
                 SET name = ?, email = ?, password = ?, salary = ?, address = ?, category = ? 
                 WHERE id = ?`;


    const values = [name, email, password, salary, address, category, id];

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    })
})

// --------------------------------------------------------
// DELETE: Remove an employee from the system (Admin Only)
// --------------------------------------------------------
router.delete('/delete_employee/:id', verifyAdmin, (req, res) =>  {
    const id = req.params.id; 
    const sql = "DELETE FROM addem WHERE id = ?";

    con.query(sql, [id], (err, result) => {
        if (err) {
            console.log("❌ Delete Error:", err);
            return res.json({ Status: false, Error: err });
        }

        return res.json({ Status: true, Result: result });
    });
});


router.delete('/delete_employee/:id', (req, res) => {
   
    const id = req.params.id;

   
    const sql = "DELETE FROM addem WHERE id = ?";

   
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.log("❌ Delete Error:", err);
            return res.json({ 
                Status: false, 
                Error: "Query Error: " + err.message 
            });
        }

        return res.json({ 
            Status: true, 
            Result: result 
        });
    });
});


export default router
