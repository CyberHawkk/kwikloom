// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Validate referral code
app.post("/api/validate-referral", async (req, res) => {
  const { code } = req.body;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("referralCode", code)
    .single();

  if (error || !data) return res.json({ success: false });
  return res.json({ success: true });
});
// Route: Register New User
app.post("/register", async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  try {
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        email,
        password, // ⚠️ Hash this in production
        referralCode: referralCode || null, // 👈 Use "referralCode" if that's how it's named in your table
      },
    ]);

    if (insertError) throw insertError;

    res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Registration failed. Try again." });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend server running at http://localhost:${port}`);
});
