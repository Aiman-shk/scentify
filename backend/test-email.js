import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testEmail = async () => {
  console.log('📧 Testing email connection...');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Pass:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '✅ Email Test - Scentify',
      text: 'If you received this, email is working! 🎉',
    });

    console.log('✅ Test email sent successfully!');
    console.log('📬 Check your inbox/spam folder.');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
};

testEmail();