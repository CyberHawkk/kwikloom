import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  provider,
  signInWithPopup,
} from "../firebase";
import { toast } from "react-toastify";
import { sendEmailVerification } from "firebase/auth";
import "@fontsource/sora";
import "@fontsource/inter";

export default function VerifyEmail() {
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const interval = setInterval(async () => {
      await user?.reload();
      if (user?.emailVerified) {
        toast.success("✅ Email verified!");
        navigate("/confirm-code");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate, user]);

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

  const handleBack = () => {
    navigate("/login");
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      if (!googleUser.emailVerified) {
        toast.info("Please verify your email.");
        navigate("/verify-email");
      } else {
        toast.success(`Welcome ${googleUser.displayName || "user"}!`);
        navigate("/confirm-code");
      }
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white/10 text-white rounded shadow border border-cyan-600 backdrop-blur font-sora">
      <h2 className="text-xl font-bold mb-4 text-cyan-300">Verify Your Email</h2>
      <p className="mb-4">
        We’ve sent a verification link to <strong>{user?.email}</strong>.
      </p>
      <p className="mb-6">
        Please check your inbox (and spam folder) and click the link to continue.
      </p>

      <button
        onClick={resendVerification}
        disabled={resending}
        className="w-full py-2 mb-3 bg-cyan-600 rounded hover:bg-cyan-700 font-medium"
      >
        {resending ? "Resending..." : "🔁 Resend Verification Email"}
      </button>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-2 mb-3 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
      >
        🔐 Sign in with Google
      </button>

      <button
        onClick={handleBack}
        className="w-full py-2 bg-pink-600 hover:bg-pink-700 rounded text-white font-medium"
      >
        ← Back to Login
      </button>
    </div>
  );
}
