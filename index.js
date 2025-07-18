// index.js or server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Route Imports
import activateRoute from "./routes/activate.js"; // ✅ Import activate route

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Resend email client
const resend = new Resend(process.env.RESEND_API_KEY);

// Root test
app.get("/", (req, res) => {
  res.send("✅ KwikLoom backend is running!");
});

// ✅ Register route
app.post("/register", async (req, res) => {
  const { name, email, referralCode } = req.body;
  const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        email,
        paid: false,
        referral_code: userReferralCode,
        referred_by: referralCode,
      },
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Registered successfully!", user: data[0] });
});

// ✅ Confirm payment route
app.post("/api/confirm-payment", async (req, res) => {
  const { email, referralCode } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .update({ paid: true })
    .eq("email", email)
    .select();

  if (error || !user.length) {
    return res.status(400).json({ error: "User not found or update failed" });
  }

  res.json({ message: "Payment confirmed!", user: user[0] });
});

// ✅ Resend referral email route
app.post("/api/resend-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const { data, error } = await supabase
    .from("users")
    .select("referral_code")
    .eq("email", email)
    .maybeSingle();

  if (error || !data) {
    return res.status(400).json({ error: "Referral code not found" });
  }

  try {
    const { error: sendError } = await resend.emails.send({
      from: "KwikLoom <noreply@kwikloom.com>",
      to: email,
      subject: "🚀 Your Referral Code is Here!",
      html: `
        <h2>Welcome to KwikLoom</h2>
        <p>Your referral code is:</p>
        <h3 style="color: #0ea5e9;">${data.referral_code}</h3>
        <p>Use it to invite others and earn ₵20 per referral!</p>
        <hr />
        <p>Need help? Just reply to this email.</p>
      `,
    });

    if (sendError) {
      return res.status(500).json({ error: "Failed to send email" });
    }

    res.json({ success: true, message: "Referral email sent!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Unexpected error sending email" });
  }
});

// ✅ Dashboard data route
app.get("/dashboard/:email", async (req, res) => {
  const { email } = req.params;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error || !user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { data: referrals, error: refError } = await supabase
    .from("users")
    .select("*")
    .eq("referred_by", user.referral_code);

  if (refError) {
    return res.status(400).json({ error: refError.message });
  }

  res.json({
    user,
    referrals,
    earnings: referrals.length * 20,
  });
});

// ✅ Include Activate Route
app.use(activateRoute); // ← this must come after express.json()

// Start server
app.listen(port, () => {
  console.log(`🚀 KwikLoom backend running on http://localhost:${port}`);
});
