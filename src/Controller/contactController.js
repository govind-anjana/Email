import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ContactModel from "../model/ContactModel.js";

dotenv.config();

export const createContact = async (req, res) => {
  try {
    const { username, email, phone, message } = req.body;

    // 1️⃣ Save contact to database
    const newContact = new ContactModel({ username, email, phone, message });
    await newContact.save();

    // 2️⃣ Gmail transporter (Railway-friendly)
    const transporter = nodemailer.createTransport({
      service: "gmail", // easier than host/port on Railway
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // 3️⃣ Mail content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New contact from ${username}`,
      text: `
Username: ${username}
Email: ${email}
Phone: ${phone}
Message: ${message}
      `,
    };

    // 4️⃣ Send email
    await transporter.sendMail(mailOptions);

    // 5️⃣ Respond with newly created contact
    res.status(200).json({
      success: true,
      message: "Contact saved & email sent successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save contact or send email",
      error: error.message,
    });
  }
};
