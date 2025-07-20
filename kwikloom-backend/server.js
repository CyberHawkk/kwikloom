// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const webhookRoutes = require("./routes/paystack"); // renamed to reflect Paystack-specific logic

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// ⚠️ Paystack requires raw body for signature verification
app.use(
  "/api/webhook/paystack",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  webhookRoutes
);

// Other JSON routes (auth, etc.)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Routes
app.use("/api/auth", authRoutes); // Auth-related routes

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✅ KwikLoom Backend is running!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
