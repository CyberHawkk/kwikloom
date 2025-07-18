import React, { useState, useEffect } from "react";
import {
  auth,
  provider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  registerWithEmail,
} from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { countries } from "../utils/countries";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState("form"); // form | otp | done
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => {
        navigate("/activate"); // Redirect after successful registration
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  useEffect(() => {
    if (step === "otp") {
      document.querySelector("input[placeholder='Enter OTP']")?.focus();
    }
  }, [step]);

  const handleEmailRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await registerWithEmail(fullName, email, password);
      if (result.success) {
        toast.success(result.message); // ✅ Verification email sent!
        navigate("/login");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("❌ Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegistration = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      toast.success("✅ Signed in with Google!");
      setStep("done");
    } catch (error) {
      toast.error("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
    });
  };

  const handlePhoneRegistration = async () => {
    if (!phoneNumber.startsWith("+")) {
      toast.warn("❗ Please enter phone number in international format (e.g. +233...)");
      return;
    }

    setupRecaptcha();
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
    } catch (error) {
      toast.error("❌ Error sending OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast.success("✅ Phone registration successful!");
      setStep("done");
    } catch (error) {
      toast.error("❌ Incorrect OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-black text-white p-6 rounded shadow-md min-h-screen flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-2 text-center text-green-400">
        🎉 Welcome to KwikLoom!
      </h1>
      <p className="text-center text-gray-400 mb-6">
        Sign up to start earning commissions and inviting friends. It's fast and free!
      </p>

      {step === "form" && (
        <>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full p-2 mb-3 bg-gray-700 text-white placeholder-gray-400 rounded"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-3 bg-gray-700 text-white placeholder-gray-400 rounded"
          />
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 bg-gray-700 text-white placeholder-gray-400 rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-300"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            required
          >
            <option value="">🌍 Select Country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleEmailRegistration}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded mb-3"
          >
            {loading ? "Registering..." : "✅ Register with Email"}
          </button>

          <button
            onClick={handleGoogleRegistration}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded mb-3"
          >
            🔐 Sign up with Google
          </button>

          <div className="text-center my-2 text-gray-400">OR</div>

          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number (e.g. +233...)"
            className="w-full p-2 mb-3 bg-gray-700 text-white placeholder-gray-400 rounded"
          />
          <div id="recaptcha-container"></div>
          <button
            onClick={handlePhoneRegistration}
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded mb-3"
          >
            {loading ? "Sending OTP..." : "📱 Register with Phone"}
          </button>

          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-2 mb-3 bg-gray-700 text-white placeholder-gray-400 rounded"
          />
          <button
            onClick={handleOTPVerify}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded mb-3"
          >
            {loading ? "Verifying..." : "✅ Verify OTP"}
          </button>
        </>
      )}

      {step === "done" && (
        <div className="text-center text-green-400 font-semibold">
          ✅ Registration successful! Redirecting...
        </div>
      )}
    </div>
  );
};

export default Register;
