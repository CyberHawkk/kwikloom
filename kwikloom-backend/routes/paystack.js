const express = require("express");
const router = express.Router();

// Example Paystack test route
router.get("/test", (req, res) => {
  res.json({ message: "Paystack route working!" });
});

module.exports = router;
