// routes/paystack.js
const express = require("express");
const crypto = require("crypto");
const { db } = require("../firebaseAdmin"); // Firebase Admin SDK

const {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} = require("firebase/firestore");
const { sendReferralEmail } = require("../utils/email");
const { generateReferralCode } = require("../utils/utils");

const router = express.Router();

router.post(
  "/webhook/paystack",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  async (req, res) => {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // Validate signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.rawBody)
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      console.warn("❌ Invalid Paystack signature");
      return res.sendStatus(403); // Unauthorized
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const email = event.data.customer.email;
      const amount = event.data.amount;
      const reference = event.data.reference;

      try {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          console.warn(`⚠️ No matching user found for email: ${email}`);
          return res.sendStatus(404);
        }

        userSnapshot.forEach(async (userDoc) => {
          const referralCode = generateReferralCode();

          await updateDoc(doc(db, "users", userDoc.id), {
            isActivated: true,
            paymentConfirmed: true,
            activatedAt: new Date().toISOString(),
            referralCode,
            paymentMethod: "MoMo",
            paymentAmount: amount,
            paymentReference: reference,
          });

          await sendReferralEmail(email, referralCode);

          console.log(`✅ Payment verified & referral code sent to ${email}`);
        });

        return res.sendStatus(200);
      } catch (error) {
        console.error("🔥 Error processing webhook:", error);
        return res.sendStatus(500);
      }
    }

    // Ignore other events (but acknowledge them)
    return res.sendStatus(200);
  }
);

module.exports = router;
