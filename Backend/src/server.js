import express from "express";
import "dotenv/config"
import { connectionDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors";

import authRoutes from "./routes/auth.Routes.js"
import userRoutes from "./routes/user.Route.js"
import chatRoutes from "./routes/chat.Routes.js"

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)

app.listen(PORT,()=>{
  console.log(`http://localhost:${PORT}/`) 
  connectionDB();  
})