// backend/routes/activate.js
const express = require("express");
const router = express.Router();
const { db } = require("../config/db"); // Assuming db is properly initialized
const crypto = require("crypto");

// Generate a 6-character referral code
function generateReferralCode(length = 6) {
  return crypto.randomBytes(length).toString("hex").substring(0, length).toUpperCase();
}

router.post("/api/activate", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user ID" });
  }

  try {
    // TODO: Replace this with real payment verification logic
    const hasPaid = true;

    if (!hasPaid) {
      return res.status(403).json({ success: false, message: "Payment not confirmed" });
    }

    const referralCode = generateReferralCode();

    await db.collection("users").doc(userId).update({
      activated: true,
      referralCode,
      activatedAt: new Date(),
    });

    return res.json({ success: true, referralCode });
  } catch (error) {
    console.error("Activation error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
