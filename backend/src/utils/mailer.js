import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

export const isMailerConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM && process.env.CONTACT_RECEIVER_EMAIL);

export default transporter;