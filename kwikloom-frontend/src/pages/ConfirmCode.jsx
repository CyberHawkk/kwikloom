import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import "@fontsource/sora";
import "@fontsource/orbitron";

export default function ConfirmCode() {
  const [referralCode, setReferralCode] = useState("");
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        toast.error("You're not logged in.");
        navigate("/");
        return;
      }

      setUser(currentUser);

      try {
        const { data, error } = await supabase
          .from("users")
          .select("payment_confirmed")
          .eq("email", currentUser.email.toLowerCase())
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast.error("User not found.");
          setCheckingPayment(false);
          return;
        }

        if (data.payment_confirmed) {
          toast.success("You're already verified!");
          navigate("/dashboard");
        } else {
          setCheckingPayment(false);
        }
      } catch (err) {
        console.error("Supabase error:", err);
        toast.error("Something went wrong checking payment.");
        setCheckingPayment(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!user) return toast.error("User not logged in.");
    if (!referralCode.trim()) return toast.error("Please enter referral code.");
    setLoading(true);

    try {
      const { data: referrer, error: referrerError } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", referralCode.trim().toLowerCase())
        .maybeSingle();

      if (referrerError) throw referrerError;
      if (!referrer) {
        toast.error("Referral code not found.");
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({
          referred_by: referralCode.trim().toLowerCase(),
          payment_confirmed: true,
        })
        .eq("email", user.email.toLowerCase());

      if (updateError) throw updateError;

      const { data: referredUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email.toLowerCase())
        .maybeSingle();

      if (userError) throw userError;
      if (!referredUser) {
        toast.error("User not found after update.");
        return;
      }

      await supabase.from("referrals").insert([
        {
          referrer_id: referrer.id,
          referred_id: referredUser.id,
        },
      ]);

      await supabase.from("earnings").insert([
        {
          user_id: referrer.id,
          source_user_id: referredUser.id,
          amount: 20,
        },
      ]);

      toast.success("✅ Referral confirmed! You're in.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Confirmation error:", error);
      toast.error("Invalid or used referral code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user?.email) return toast.error("You must be logged in.");
    setResending(true);

    try {
      const res = await fetch("http://localhost:5000/api/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Resend email failed. Response:", text);
        toast.error("Something went wrong resending email.");
        return;
      }

      const data = await res.json();
      if (data.success) {
        toast.success("📧 Email resent successfully!");
      } else {
        toast.error(data.error || "Failed to resend email.");
      }
    } catch (err) {
      console.error("Resend email error:", err);
      toast.error("Something went wrong.");
    } finally {
      setResending(false);
    }
  };

  if (checkingPayment) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sora">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500 border-opacity-50"></div>
          <p className="text-cyan-300 text-sm">Checking your payment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 font-sora">
      <div className="relative bg-white/5 backdrop-blur-lg border border-cyan-500 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center text-white">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 px-3 py-1 text-xs rounded-md bg-transparent border border-cyan-400 text-cyan-300 hover:bg-cyan-700 hover:text-white shadow-sm transition duration-300"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold font-orbitron text-cyan-300 mb-2 animate-pulse drop-shadow">
          Confirm Referral Code
        </h1>

        <p className="text-sm text-cyan-100 mb-6 px-2 leading-relaxed">
          Enter the referral code you received via email after sending your ₵100 BTC activation.
        </p>

        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="e.g. kwik-abc123"
          className="w-full px-4 py-2 rounded-lg bg-black/60 border border-cyan-300 text-center text-white placeholder:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 mb-3"
          style={{ boxShadow: "0 0 12px rgba(34, 211, 238, 0.8)" }}
        >
          {loading ? "Processing..." : "Confirm & Continue"}
        </button>

        <button
          onClick={handleResendEmail}
          disabled={resending}
          className="w-full py-2 bg-black/30 border border-cyan-400 hover:bg-cyan-600 text-cyan-200 font-semibold rounded-lg transition duration-300"
        >
          {resending ? "Resending..." : "📧 Resend Email"}
        </button>
      </div>
    </div>
  );
}
