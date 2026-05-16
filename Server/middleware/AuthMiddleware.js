import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        
        return res.json({ Status: false, Error: "ไม่มี Token กรุณา Login" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({ Status: false, Error: "Token ไม่ถูกต้อง หรือหมดอายุ" });
        } else {
           
            req.email = decoded.email;
            req.role = decoded.role;
            
            next(); 
        }
    });
};