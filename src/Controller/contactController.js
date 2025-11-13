import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import ContactModel from "../model/ContactModel.js";

dotenv.config();
//  Create new contact (POST)
export const createContact = async (req, res) => {
  try {
    const { username, email, phone, message } = req.body;

    // Save to database
    const newContact = new ContactModel({ username, email, phone, message });
    await newContact.save();

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Admin Gmail
        pass: process.env.EMAIL_PASS,  // App Password
      },
    });

    // Mail content
    const mailOptions = {
      from: email, // user's email
      to: process.env.EMAIL_USER, // admin's email
      subject: `New contact from ${username}`,
      text: `
        Username: ${username}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Contact saved and email sent successfully!",
      data: newContact, // return saved data
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
