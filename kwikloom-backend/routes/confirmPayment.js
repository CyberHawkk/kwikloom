import express from "express";
import {
  sendConfirmationEmail,
  sendReferralBonusEmail,
  sendReferralEmail,
} from "../utils/sendEmail.js"; // ✅ Corrected path
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

router.post("/", async (req, res) => {
  try {
    const { email, referralCode, txid, amount } = req.body;

    // Validate required fields
    if (!email || !referralCode || !txid || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Find user making the payment
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2. Update user's payment status and store txid
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ paid: true, payment_txid: txid, referred_by: referralCode })
      .eq("email", email);

    if (updateUserError) {
      return res.status(500).json({ error: "Failed to update user status." });
    }

    // 3. Log the transaction
    const { error: txError } = await supabase
      .from("transactions")
      .insert([{ user_id: user.id, txid, amount }]);

    if (txError) {
      return res.status(500).json({ error: "Transaction logging failed." });
    }

    // 4. Find referrer by referral code
    const { data: referrer, error: referrerError } = await supabase
      .from("users")
      .select("*")
      .eq("referral_code", referralCode)
      .single();

    if (referrerError || !referrer) {
      return res.status(400).json({ error: "Invalid referral code." });
    }

    // 5. Credit ₵20 to referrer's balance
    const newBalance = (referrer.balance || 0) + 20;
    const { error: bonusError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("email", referrer.email);

    if (bonusError) {
      return res.status(500).json({ error: "Failed to credit referrer." });
    }

    // 6. Log referral record
    const { error: referralLogError } = await supabase
      .from("referrals")
      .insert([
        {
          referrer_email: referrer.email,
          referred_email: email,
          amount: 20,
          txid,
        },
      ]);

    if (referralLogError) {
      console.error("Referral log error:", referralLogError);
    }

    // 7. Send emails
    await sendReferralEmail(email, referralCode); // code to new user
    await sendReferralBonusEmail(referrer.email, email); // bonus email
    await sendConfirmationEmail(email, referralCode); // payment confirm

    return res.status(200).json({
      message: "✅ Referral confirmed, ₵20 credited & emails sent.",
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
