import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ContactModel from "../model/ContactModel.js";

dotenv.config();

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Build simple text email
const buildContactText = ({ username, email, phone, message }) => `
New Contact / User Details
Name: ${username || "-"}
Email: ${email || "-"}
Phone: ${phone || "-"}
Message: ${message || "-"}

Received at: ${new Date().toLocaleString()}
`;

export const createContact = async (req, res) => {
  try {
    const { username, email, phone, message } = req.body;

    // Save to DB
    const newContact = new ContactModel({ username, email, phone, message });
    await newContact.save();

    // Prepare email
    const mailOptions = {
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `New Contact: ${username || "Unknown"}`,
      text: buildContactText({ username, email, phone, message }),
      replyTo: email || undefined,
    };
    transporter.verify((error, success) => {
  if (error) console.log("SMTP Error:", error);
  else console.log("SMTP Ready:", success);
});
    // Send email
    const info = await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Contact saved and email sent",
      mailInfo: { messageId: info.messageId },
      contact: newContact,
    });
  } catch (error) {
    console.error("createContact error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
