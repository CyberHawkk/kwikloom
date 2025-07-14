import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "@fontsource/sora";
import "@fontsource/orbitron";
import toast from "react-hot-toast";

export default function ActivatePage() {
  const navigate = useNavigate();
  const btcAddress = "bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(btcAddress).then(() => {
      setCopied(true);
      toast.success("BTC address copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 text-white font-sora relative">
      {/* ← Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 px-3 py-1 text-xs rounded-md bg-transparent border border-cyan-400 text-cyan-300 hover:bg-cyan-700 hover:text-white shadow-sm transition duration-300 z-50"
      >
        ← Back
      </button>

      <div className="bg-white/5 backdrop-blur-lg border border-cyan-500 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold font-orbitron text-cyan-300 mb-4 drop-shadow">
          Activate Your Account
        </h1>

        <p className="text-sm text-cyan-100 mb-6 leading-relaxed px-2">
          To join <span className="text-cyan-400 font-semibold">KwikLoom</span>, send a one-time BTC activation payment of
          <span className="text-yellow-300 font-bold"> ₵100</span> to the wallet address below.
          After payment, check your email for a referral code to continue.
        </p>

        <div className="bg-black/30 p-4 rounded-lg border border-cyan-500 mb-4">
          <p className="text-cyan-200 text-sm">BTC Wallet Address:</p>
          <code className="block text-yellow-300 text-xs break-words mt-1 mb-2">
            {btcAddress}
          </code>

          <button
            onClick={handleCopy}
            className="w-full py-1 text-sm bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg transition duration-300"
          >
            {copied ? "✓ Copied!" : "📋 Copy BTC Address"}
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <QRCodeCanvas value={btcAddress} size={120} bgColor="#000" fgColor="#facc15" />
        </div>

        <p className="text-xs text-cyan-100 px-2">
          Use any trusted crypto wallet to send the exact amount. You’ll receive an email with a referral code once we confirm.
        </p>
      </div>
    </div>
  );
}
