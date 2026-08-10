import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load env BEFORE transporter setup (ESM imports are hoisted)
dotenv.config({ path: "./.env" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // false for 587, true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
