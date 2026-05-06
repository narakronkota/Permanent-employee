import mysql from "mysql2"; 
import dotenv from 'dotenv';

dotenv.config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // เข้ารหัสข้อมูลที่รับ-ส่งระหว่าง Render - avion 
    ssl: {
        rejectUnauthorized: false
    }
})
console.log("🔍 Checking Host:", process.env.DB_HOST);
console.log("🔍 Checking Port:", process.env.DB_PORT);
con.connect((err) => {
  if(err){
    console.log("Database connection error")
  } else {
    console.log("Connected to Aiven MySQL Cloud")
  }
})

export default con