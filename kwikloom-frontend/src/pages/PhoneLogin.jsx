// src/pages/PhoneLogin.jsx
import { useState, useRef } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import { useNavigate } from "react-router-dom";

const PhoneLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const recaptchaContainerRef = useRef(null);
  const navigate = useNavigate();

  const formatPhone = (number) => {
    if (number.startsWith("0")) return "+233" + number.slice(1);
    if (!number.startsWith("+233")) return "+233" + number;
    return number;
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => console.log("reCAPTCHA solved", response),
      });
    }
  };

  const sendOTP = async () => {
    const formattedPhone = formatPhone(phone);
    setupRecaptcha();
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmation(confirmationResult);
      alert("OTP sent to " + formattedPhone);
    } catch (err) {
      alert("Failed to send OTP: " + err.message);
    }
  };

  const verifyOTP = async () => {
    try {
      await confirmation.confirm(otp);
      alert("✅ Phone Verified!");
      navigate("/dashboard");
    } catch (err) {
      const newCount = errorCount + 1;
      setErrorCount(newCount);
      if (newCount >= 3) {
        alert("❌ Too many failed attempts. Please try again later.");
        window.location.reload();
      } else {
        alert("Incorrect OTP. Attempt " + newCount + " of 3.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h2 className="text-2xl font-bold mb-4">📱 Phone Login</h2>

      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter Ghana Phone (e.g., 0551234567)"
        className="border rounded px-4 py-2 mb-2 w-full max-w-md"
      />

      <button onClick={sendOTP} className="bg-blue-600 text-white px-4 py-2 rounded w-full max-w-md">
        Send OTP
      </button>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="border rounded px-4 py-2 my-3 w-full max-w-md"
      />

      <button onClick={verifyOTP} className="bg-green-600 text-white px-4 py-2 rounded w-full max-w-md">
        Verify OTP
      </button>

      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
    </div>
  );
};

export default PhoneLogin;
