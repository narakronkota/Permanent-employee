import jwt from 'jsonwebtoken';

// --------------------------------------------------------
// Middleware: Verify JWT Token and Admin Privileges
// --------------------------------------------------------

export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;
    //// Check if token exists
    if (!token) {
        
        return res.json({ Status: false, Error: "ไม่มี Token กรุณา Login" });
    }
    //// Verify token validity and extract payload
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({ Status: false, Error: "Token ไม่ถูกต้อง หรือหมดอายุ" });
        } else {
    //// Attach user info to the request object
            req.email = decoded.email;
            req.role = decoded.role;
            
            next(); 
        }
    });
};