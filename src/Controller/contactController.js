import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import ContactModel from "../model/ContactModel.js";

dotenv.config();
//  Create new contact (POST)
export const createContact = async (req, res) => {
  try {
    const { username, email, phone, message } = req.body;

    // ✅ Optional: Remove duplicate check if you want same email multiple times
    // const existingContact = await ContactModel.findOne({ email });
    // if (existingContact) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "This email is already registered!",
    //   });
    // }

    // 1️⃣ Save contact to database
    const newContact = new ContactModel({ username, email, phone, message });
    await newContact.save();

    // 2️⃣ Gmail transporter (Railway-friendly)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // 3️⃣ Mail content
    const mailOptions = {
      from: process.env.EMAIL_USER,   // Must be your Gmail
      replyTo: email,                 // User email
      to: process.env.EMAIL_USER,     // Admin receives mail
      subject: `New contact from ${username}`,
      text: `
        Username: ${username}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    // 4️⃣ Send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log("MAIL ERROR:", err);
      else console.log("MAIL SENT:", info.response);
    });

    // 5️⃣ Respond with saved contact
    res.status(200).json({
      success: true,
      message: "Contact saved & email sent successfully!",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save contact or send email",
      error: error.message,
    });
  }
};

//  Get all contacts (GET)
export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};
