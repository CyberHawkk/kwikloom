import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";

export default function ReferralCode() {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // ⬅️ Go back to the previous page
  };

  const handleValidate = async () => {
    if (!referralCode.trim()) {
      toast.error("Please enter the referral code sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/validate-referral", { referralCode });

      toast.success(res.data.message || "Referral validated successfully!");
      navigate("/dashboard"); // ✅ Redirect to dashboard
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired referral code.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black px-4 relative">
      {/* 🔙 Floating Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 bg-white text-black rounded-full shadow-md hover:bg-gray-100 transition p-2"
      >
        ← Back
      </button>

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">🎯 Confirm Referral Code</h2>
        <p className="text-sm text-gray-600 text-center">
          Enter the referral code sent to your email after payment.
        </p>

        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="e.g. KWIK-12345"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <button
          onClick={handleValidate}
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          {loading ? "Checking..." : "Submit & Continue"}
        </button>
      </div>
    </div>
  );
}
