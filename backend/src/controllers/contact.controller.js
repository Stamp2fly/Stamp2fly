import mailer, { isMailerConfigured } from "../utils/mailer.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sendContactMessage = async (req, res) => {
  try {
    const fullName = String(req.body?.fullName || "").trim();
    const email = String(req.body?.email || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: "fullName, email and message are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (!isMailerConfigured()) {
      return res.status(500).json({
        message: "Contact email is not configured on server",
      });
    }

    await mailer.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Contact Message from ${fullName}`,
      text: `You have received a new contact inquiry.\n\nName: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
          <h2 style="margin-bottom: 8px;">New Contact Inquiry</h2>
          <p style="margin: 0 0 6px;"><strong>Name:</strong> ${fullName}</p>
          <p style="margin: 0 0 6px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 14px 0 6px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};