import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  provider,
  signInWithPopup,
} from "../firebase";
import {
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const interval = setInterval(async () => {
      await reload(auth.currentUser);
      if (auth.currentUser?.emailVerified) {
        toast.success("✅ Email verified!");
        navigate("/activate"); // or "/confirm-code" if that's your next step
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleContinue = async () => {
    setChecking(true);
    await reload(auth.currentUser);
    if (auth.currentUser?.emailVerified) {
      toast.success("✅ Verified!");
      navigate("/activate");
    } else {
      toast.error("❌ Email not verified. Please check your inbox.");
    }
    setChecking(false);
  };

  const resendVerification = async () => {
    if (!auth.currentUser) {
      toast.error("No user logged in.");
      return;
    }

    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("📨 Verification email resent!");
    } catch (err) {
      console.error("Resend verification error:", err.message);
      toast.error("Failed to resend verification.");
    }
    setResending(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      if (!googleUser.emailVerified) {
        toast.info("Please verify your email.");
        navigate("/verify-email");
      } else {
        toast.success(`Welcome ${googleUser.displayName || "User"}!`);
        navigate("/activate");
      }
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      toast.error("Google sign-in failed.");
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white/10 text-white rounded shadow border border-cyan-600 backdrop-blur font-sora">
      <h2 className="text-xl font-bold mb-4 text-cyan-300">📩 Verify Your Email</h2>
      <p className="mb-4">
        We've sent a verification link to{" "}
        <strong>{user?.email || "your email"}</strong>.
      </p>
      <p className="mb-6">
        Please check your inbox and click the link. This page will refresh automatically.
      </p>

      <button
        onClick={handleContinue}
        disabled={checking}
        className="w-full py-2 mb-3 bg-green-600 hover:bg-green-700 rounded font-medium"
      >
        {checking ? "Checking..." : "✅ I've Verified My Email"}
      </button>

      <button
        onClick={resendVerification}
        disabled={resending}
        className="w-full py-2 mb-3 bg-blue-600 hover:bg-blue-700 rounded font-medium"
      >
        {resending ? "Resending..." : "🔁 Resend Verification Email"}
      </button>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-2 mb-3 bg-red-600 hover:bg-red-700 rounded font-medium"
      >
        🔐 Sign in with Google
      </button>

      <button
        onClick={handleBack}
        className="w-full py-2 bg-pink-600 hover:bg-pink-700 rounded font-medium"
      >
        ← Back to Login
      </button>
    </div>
  );
}
