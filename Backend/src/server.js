import express from "express";
import "dotenv/config"
import authRoutes from "./routes/auth.Routes.js"
import { connectionDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
  console.log(`http://localhost:${PORT}/`) 
  connectionDB();  
})