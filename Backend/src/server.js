import express from "express";
import "dotenv/config"
import authRoutes from "./routes/auth.Routes.js"
import userRoutes from "./routes/user.Route.js"
import { connectionDB } from "./lib/db.js";
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)

app.listen(PORT,()=>{
  console.log(`http://localhost:${PORT}/`) 
  connectionDB();  
})