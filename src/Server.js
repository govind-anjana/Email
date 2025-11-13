import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createContact, getContacts } from "./Controller/contactController.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));


//  Create Contact
app.post("/contact", createContact);

// 📄 Get All Contacts (Admin Only)
app.get("/contact",getContacts)
// Default route
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
