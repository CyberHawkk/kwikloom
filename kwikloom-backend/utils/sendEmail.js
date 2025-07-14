// utils/sendEmail.js

import dotenv from "dotenv";
dotenv.config(); // ✅ Must be first before importing env-dependent modules

import { Resend } from "resend";
import axios from "axios";

// ✅ Load environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_FROM || "kwikloom@resend.dev";
const EMAIL_API_URL = process.env.EMAIL_API_URL;
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;

// 🔒 Warn if critical environment variables are missing
if (!RESEND_API_KEY) console.warn("⚠️ RESEND_API_KEY is missing");
if (!FROM_EMAIL) console.warn("⚠️ FROM_EMAIL is missing");
if (!EMAIL_API_URL) console.warn("⚠️ EMAIL_API_URL is missing (for fallback)");
if (!EMAIL_API_KEY) console.warn("⚠️ EMAIL_API_KEY is missing (for fallback)");

const resend = new Resend(RESEND_API_KEY);

/**
 * ✅ Send welcome/confirmation email after activation
 * @param {string} email - The email address of the user who just activated
 * @param {string} referralCode - The referral code used or assigned
 */
export async function sendConfirmationEmail(email, referralCode) {
  if (!email || !referralCode) {
    console.error("❌ Missing email or referralCode.");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "🎉 Welcome to KwikLoom – Your Activation is Confirmed!",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#06b6d4;">🎉 Welcome to KwikLoom</h2>
          <p>We’ve received your ₵100 BTC activation payment.</p>
          <p><strong>Referral Code:</strong> ${referralCode}</p>
          <p>You’re now officially part of the KwikLoom community!</p>
          <p>Refer others to earn ₵20 per signup. 💸</p>
          <br />
          <p>– The KwikLoom Team</p>
        </div>
      `,
      text: `Welcome to KwikLoom! Referral Code: ${referralCode}`,
    });

    if (error) {
      console.error("❌ Failed to send confirmation email:", error);
    } else {
      console.log("✅ Confirmation email sent to:", email);
    }
  } catch (err) {
    console.error("❌ Unexpected error in sendConfirmationEmail:", err.message);
  }
}

/**
 * ✅ Notify the referrer they earned ₵20
 * @param {string} referrerEmail - Referrer's email
 * @param {string} referredEmail - Email of the new user who signed up
 */
export async function sendReferralBonusEmail(referrerEmail, referredEmail) {
  if (!referrerEmail || !referredEmail) {
    console.error("❌ Missing referrer or referred email.");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: referrerEmail,
      subject: "💰 You Just Earned ₵20 on KwikLoom!",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2>Cha-ching! 💰</h2>
          <p><strong>${referredEmail}</strong> just joined KwikLoom using your referral code.</p>
          <p>You’ve earned ₵20 — it’s already in your account.</p>
          <p>Keep sharing your code to earn more!</p>
          <br />
          <p>– The KwikLoom Team</p>
        </div>
      `,
      text: `${referredEmail} joined KwikLoom using your code. You earned ₵20!`,
    });

    if (error) {
      console.error("❌ Failed to send referral bonus email:", error);
    } else {
      console.log("✅ Referral bonus email sent to:", referrerEmail);
    }
  } catch (err) {
    console.error("❌ Unexpected error in sendReferralBonusEmail:", err.message);
  }
}

/**
 * ✅ Fallback: Send referral code email using HTTP API if Resend fails
 * @param {string} recipient - The recipient's email address
 * @param {string} referralCode - The referral code to send
 */
export async function sendReferralEmail(recipient, referralCode) {
  if (!recipient || !referralCode) {
    console.error("❌ Missing recipient or referralCode.");
    return;
  }

  try {
    const res = await axios.post(
      EMAIL_API_URL,
      {
        from: FROM_EMAIL,
        to: recipient,
        subject: "🎉 Your KwikLoom Referral Code",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h3>Here’s your KwikLoom referral code:</h3>
            <h2 style="color:#06b6d4;">${referralCode}</h2>
            <p>Share it with friends and earn ₵20 per signup!</p>
            <br />
            <p>– The KwikLoom Team</p>
          </div>
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${EMAIL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Fallback referral email sent:", res.data);
  } catch (err) {
    console.error("❌ Failed to send fallback referral email:", err.response?.data || err.message);
  }
}
