// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use another provider
  auth: {
    user: process.env.EMAIL_USER, // put your email in .env
    pass: process.env.EMAIL_PASS,
  },
});

const sendReferralEmail = async (email, code) => {
  const mailOptions = {
    from: `"KwikLoom" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your KwikLoom Referral Code 🎉",
    html: `<h2>Welcome to KwikLoom!</h2><p>Your referral code is: <b>${code}</b></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Referral email sent to:", email);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
};

module.exports = { sendReferralEmail };
