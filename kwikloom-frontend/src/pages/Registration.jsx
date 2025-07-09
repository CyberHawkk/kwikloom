import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import "@fontsource/sora";
import "@fontsource/inter";
import AnnouncementModal from "../components/AnnouncementModal";

export default function Registration() {
  // ✅ FIXED HERE: Hook must be inside the function component body
  const [showModal, setShowModal] = useState(true);

  const [step, setStep] = useState(1);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const avatarOptions = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Olivia",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Zara",
    "https://api.dicebear.com/7.x/micah/svg?seed=Aisha",
    "https://api.dicebear.com/7.x/big-smile/svg?seed=Chris",
    "https://api.dicebear.com/7.x/big-ears/svg?seed=Nina",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Max",
  ];

  const steps = [
    { icon: "💰", text: "Pay ₵100 one-time to activate your account." },
    { icon: "🔑", text: "Receive a unique referral code after signup." },
    { icon: "💵", text: "Earn ₵20 whenever someone joins using your code." },
    { icon: "♾️", text: "Refer unlimited people — earn ₵20 for each." },
    { icon: "🚀", text: "Everyone you refer can also start earning by sharing their own code." },
  ];

  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bitcoin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const BTC_ADDRESS = "bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8";

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // ✅ Email login logic
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Invalid email or password");
    }
  };

  // ✅ Forgot password logic
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent. Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  // ✅ Payment confirmation submit
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!country) return alert("Please select your country");
    if (!paymentMethod) return alert("Please select a payment method");
    setStep(2);
  };

  // ✅ Referral code + final registration
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      country,
      paymentMethod,
      name,
      email,
      password,
      referralCode,
    };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setStep(1);
        setCountry("");
        setPaymentMethod("Bitcoin");
        setName("");
        setEmail("");
        setPassword("");
        setReferralCode("");
        setShowPassword(false);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logo SVG
  const BrandLogo = () => (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#32e0c4" />
          <stop offset="100%" stopColor="#1bb89f" />
        </linearGradient>
      </defs>
      <path
        d="M12 52 L28 12 L44 52 L36 52 L32 40 L28 52 Z"
        fill="url(#brandGradient)"
        stroke="#1bb89f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="10" stroke="#32e0c4" strokeWidth="2" fill="none" />
    </svg>
  );

  return (
    <>
      {/* ✅ Modal Popup */}
      {showModal && <AnnouncementModal onClose={() => setShowModal(false)} />}

      {/* ✅ Your existing UI follows here (cut for brevity to avoid length issues)... */}
      {/* Keep everything below here unchanged from your last code! */}
    </>
  );
}
