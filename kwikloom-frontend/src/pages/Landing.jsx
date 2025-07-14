// src/pages/Landing.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  auth,
  provider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "../firebase";
import { toast } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider);
      toast.success("Redirecting to Google...");
    } catch {
      toast.error("Google Sign-In failed.");
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in!");
      navigate("/confirm-code");
    } catch {
      toast.error("Login failed.");
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Registered and signed in!");
      navigate("/confirm-code");
    } catch {
      toast.error("Registration failed.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch {
      toast.error("Error sending reset email.");
    }
  };

  const confirmPayment = async () => {
    if (!user?.email || !referralCode) {
      toast.error("Missing info.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, referralCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Payment confirmed!");
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Confirmation failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sora px-4">
      <div className="w-full max-w-lg bg-[#0f172a] border border-cyan-500 p-8 rounded-2xl shadow-2xl space-y-4">
        <h1 className="text-3xl font-bold text-cyan-300 text-center">Welcome to KwikLoom</h1>
        <p className="text-center text-sm text-gray-400">₵100 BTC activation • ₵20 per referral</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold tracking-wide"
        >
          Sign In with Google
        </button>

        <div className="border-t border-cyan-700 pt-4 space-y-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#1e293b] border border-cyan-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#1e293b] border border-cyan-400 focus:outline-none"
          />

          <button
            onClick={handleEmailLogin}
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg"
          >
            Login with Email
          </button>
          <button
            onClick={handleRegister}
            className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-lg"
          >
            Register
          </button>
          <button
            onClick={handleResetPassword}
            className="text-sm text-cyan-400 underline w-full text-center"
          >
            Forgot Password?
          </button>
        </div>

        {user && (
          <div className="pt-6 border-t border-cyan-800 space-y-3">
            <p className="text-sm">Already paid? Confirm below:</p>
            <input
              type="text"
              placeholder="Referral Code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-4 py-2 bg-[#1e293b] border border-yellow-500 text-white rounded"
            />
            <button
              onClick={confirmPayment}
              className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold rounded hover:from-yellow-600 hover:to-orange-500"
            >
              ✅ I’ve Paid & Entered Code
            </button>
          </div>
        )}

        <div className="mt-6 text-sm text-center text-gray-400 border-t border-cyan-800 pt-4">
          <p className="text-cyan-300">Haven’t paid yet?</p>
          <Link to="/activate" className="text-yellow-300 hover:underline font-medium">
            Go to Activation Page
          </Link>
        </div>
      </div>
    </div>
  );
}
