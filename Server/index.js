import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import adminRouter from "./Routes/AdminRoute.js";
import userRouter from './Routes/๊UserRoute.js';
import authroutes from './Routes/AuthRoute.js'
const app = express()


app.use(cors({
  origin: [
    "https://emolyee-contact.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser())
app.use(express.json())

app.use('/auth', adminRouter)
app.use('/user', userRouter)
app.use('/auth', authroutes);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;
