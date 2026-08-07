import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: `"Scentify" <${process.env.EMAIL_USER}>`,
  to: 'your-email@gmail.com', // Change to your email
  subject: 'Scentify Test - Please Mark as Not Spam',
  text: 'This is a test email from Scentify. If you receive this, please mark it as "Not Spam".',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
      <h2>Scentify</h2>
      <p>This is a test email from Scentify.</p>
      <p>If you receive this, please mark it as "Not Spam".</p>
      <p style="color: #888; font-size: 12px;">© 2026 Scentify. All rights reserved.</p>
    </div>
  `,
}).then(() => {
  console.log('✅ Test email sent!');
  console.log('📬 Please check your inbox/spam and mark as NOT SPAM.');
}).catch(console.error);