// src/pages/PhoneAuth.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved:", response);
          },
        },
        auth
      );
    }
  }, []);

  const formatGhanaNumber = (input) => {
    let formatted = input.trim();
    if (formatted.startsWith("0")) {
      formatted = "+233" + formatted.slice(1);
    } else if (!formatted.startsWith("+")) {
      formatted = "+233" + formatted;
    }
    return formatted;
  };

  const sendOTP = async () => {
    const formatted = formatGhanaNumber(phone);
    setError("");
    setSuccess("");
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formatted,
        appVerifier
      );
      setConfirmResult(confirmation);
      setSuccess("✅ OTP sent successfully.");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to send OTP. Please try again.");
    }
  };

  const verifyOTP = async () => {
    setError("");
    setSuccess("");
    if (!confirmResult) {
      return setError("❌ Please request an OTP first.");
    }

    try {
      await confirmResult.confirm(otp);
      setSuccess("✅ OTP verified successfully!");
      setTimeout(() => navigate("/payment"), 1500); // redirect to /payment
    } catch (err) {
      console.error("OTP Error:", err);
      setAttempts((prev) => prev + 1);
      setError("❌ Incorrect OTP. Try again.");

      if (attempts + 1 >= 3) {
        setError("❌ Too many failed attempts. Please try again later.");
        setConfirmResult(null);
        setAttempts(0);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          📱 Phone Number Verification
        </h2>

        <input
          type="tel"
          placeholder="Enter phone number (e.g. 0551234567)"
          className="w-full border px-4 py-2 mb-4 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {confirmResult ? (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border px-4 py-2 mb-4 rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOTP}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              ✅ Verify OTP
            </button>
          </>
        ) : (
          <button
            onClick={sendOTP}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            📩 Send OTP
          </button>
        )}

        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        <div id="recaptcha-container"></div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
