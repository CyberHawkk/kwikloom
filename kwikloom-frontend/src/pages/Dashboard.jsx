import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { QRCodeCanvas } from "qrcode.react";
import "@fontsource/sora";
import "@fontsource/orbitron";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        if (!u.emailVerified) {
          toast.error("Please verify your email to access the dashboard.");
          navigate("/verify-email");
          return;
        }

        setUser(u);
        await fetchUserData(u.email);
      } else {
        setUser(null);
        navigate("/"); // Optional: Redirect unauthenticated users
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/user?email=${email}`);
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance || 0);
        setReferralCount(data.referrals_count || 0);
        setReferralCode(data.referral_code || "");
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    setWithdrawMessage("");
    try {
      const res = await fetch("http://localhost:5000/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setWithdrawMessage("✅ Withdrawal request sent.");
        setBalance((prev) => prev - data.amount);
      } else {
        setWithdrawMessage(data.message || "Withdrawal failed.");
      }
    } catch (err) {
      setWithdrawMessage("An error occurred during withdrawal.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020c1b] text-white font-sora px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-10 bg-[#04192c] rounded-xl shadow-2xl p-8 relative">

        {/* ← Back to Sign In */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-sm text-cyan-300 hover:underline"
        >
          ← Back
        </button>

        {/* 🪙 Bouncing Bitcoin Icon */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <img
            src="/bitcoin.png"
            alt="Bitcoin"
            className="w-14 h-14"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://cryptologos.cc/logos/bitcoin-btc-logo.png";
            }}
          />
        </div>

        <h1 className="text-2xl font-bold text-cyan-300 text-center font-orbitron">
          {user ? `Welcome, ${user.displayName || user.email}` : "Welcome"}
        </h1>

        {/* 🔢 Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-[#09342b] p-6 rounded-xl shadow-lg">
            <h2 className="text-lg text-green-400 font-semibold">Balance</h2>
            <p className="text-3xl font-bold">₵{balance}</p>
          </div>
          <div className="bg-[#07292c] p-6 rounded-xl shadow-lg">
            <h2 className="text-lg text-yellow-400 font-semibold">Referrals</h2>
            <p className="text-3xl font-bold">{referralCount}</p>
          </div>
          <div className="bg-[#121f33] p-6 rounded-xl shadow-lg border border-cyan-400">
            <h2 className="text-lg text-cyan-300 font-semibold">Your Referral Code</h2>
            <code className="text-xl font-mono block mt-2 text-white">
              {referralCode}
            </code>
            <button
              onClick={copyToClipboard}
              className="mt-3 px-4 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 rounded-md"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>

        {/* 📤 QR to Share Referral */}
        <div className="bg-[#0f1c2d] rounded-xl p-6 text-center border border-cyan-600">
          <h2 className="text-lg text-purple-300 font-semibold mb-4">
            Share Your Referral Code
          </h2>
          <QRCodeCanvas
            value={referralCode || "default-code"}
            size={160}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
            className="mx-auto"
          />
        </div>

        {/* 🏧 Withdraw Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing || balance < 100}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              isWithdrawing || balance < 100
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#1bb89f] to-[#32e0c4] hover:opacity-90"
            }`}
          >
            {isWithdrawing ? "Processing..." : "Request Withdrawal"}
          </button>
          {withdrawMessage && (
            <p className="mt-2 text-yellow-400 text-sm">{withdrawMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
