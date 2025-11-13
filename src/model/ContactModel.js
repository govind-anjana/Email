import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String, 
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } 
);
export default mongoose.model("Contact", contactSchema);
