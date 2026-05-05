import mysql from "mysql"

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "empoyee"
})

con.connect((err) => {
  if(err){
    console.log("Database connection error")
  } else {
    console.log("Connected to MySQL")
  }
})

export default con