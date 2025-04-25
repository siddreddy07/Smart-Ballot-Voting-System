import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'siddharthreddy627@gmail.com', // your Gmail address
    pass: 'vjitzbweiqnvdgec',             // your 16-digit App Password (no spaces needed)
  },
});

function generateHtml(otp) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <header style="display: flex; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px;">
        <img src="../../client/public/logo.png" alt="Logo" style="height: 50px; width: 50px; margin-right: 15px;" />
        <h1 style="font-size: 24px; margin: 0;">Smart Voting System</h1>
      </header>
      <main style="font-size: 16px; color: #333;">
        <p>Hello,</p>
        <p>Your OTP for <strong>registration</strong> is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #4CAF50; margin: 20px 0;">${otp}</div>
        <p>Please enter this OTP to complete your registration.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      </main>
    </div>
  `;
}

export async function sendEmail({ to, subject, text, otp }) {
  try {
    const info = await transporter.sendMail({
      from: `"Smart Voting System" <siddharthreddy627@gmail.com>`,  // ✅ Corrected here
      to,
      subject,
      text,
      html: generateHtml(otp),
    });
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
