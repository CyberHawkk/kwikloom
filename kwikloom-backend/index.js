/**
 * ✅ KwikLoom Backend
 * - Loads env config
 * - Validates environment variables
 * - Initializes Supabase & Resend clients
 * - Sets up Express server with confirm-payment route
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import confirmPaymentRoute from "./routes/confirmPayment.js";

// ✅ Load environment variables
dotenv.config({ override: true });

// ✅ Utility: Warn if any required env var is missing
function checkEnvVar(name) {
  if (!process.env[name]) {
    console.warn(`⚠️ Environment variable ${name} is not set`);
  }
}

// ✅ Check required environment variables
checkEnvVar("SUPABASE_URL");
checkEnvVar("SUPABASE_SERVICE_ROLE_KEY");
checkEnvVar("RESEND_API_KEY");
checkEnvVar("FROM_EMAIL");
checkEnvVar("EMAIL_API_URL");
checkEnvVar("EMAIL_API_KEY");
checkEnvVar("PORT"); // Optional fallback

// ✅ Log some for debugging (safe ones)
console.log("🔐 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("📩 RESEND_API_KEY:", process.env.RESEND_API_KEY);

// ✅ Initialize Supabase and Resend clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Inject clients into each request
app.use((req, res, next) => {
  req.supabase = supabase;
  req.resend = resend;
  next();
});

// ✅ Base route
app.get("/", (req, res) => {
  res.send("✅ KwikLoom backend is live!");
});

// ✅ API routes
app.use("/api/confirm-payment", confirmPaymentRoute);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 KwikLoom backend running at http://localhost:${PORT}`);
});
