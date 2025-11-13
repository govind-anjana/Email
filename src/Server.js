import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from '../src/config/db.js'
import cors from "cors";
import contactRoutes from '../src/routes/contactRoutes.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

// MongoDB Connection
connectDB();


app.use("/contact",contactRoutes);

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
