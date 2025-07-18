import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Landing = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Set up invisible reCAPTCHA (only once)
  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA verified");
        },
        "expired-callback": () => {
          console.warn("reCAPTCHA expired. Please try again.");
        },
      });
    }
    return window.recaptchaVerifier;
  };

  // ✅ Handle phone number registration
  const handlePhoneRegister = async () => {
    if (!phoneNumber || !phoneNumber.startsWith("+")) {
      toast.error("Please enter phone in international format (e.g., +233...)");
      return;
    }

    try {
      setLoading(true);
      const recaptchaVerifier = setUpRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

      // Store confirmation for OTP step
      window.confirmationResult = confirmationResult;

      toast.success("✅ OTP sent! Please check your phone.");
      navigate("/activate"); // redirect to OTP verification page
    } catch (error) {
      console.error("Phone sign-in error:", error);
      toast.error("❌ Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">📱 Register with Phone</h1>

      <input
        type="tel"
        placeholder="+233XXXXXXXXX"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="p-2 rounded text-black mb-4 w-64"
      />

      <button
        onClick={handlePhoneRegister}
        disabled={loading}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Register with Phone"}
      </button>

      {/* Hidden Recaptcha */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Landing;
