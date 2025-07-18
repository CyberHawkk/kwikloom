import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function Activate() {
  const [referralCode, setReferralCode] = useState("");
  const [user, loading] = useAuthState(auth);
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const confirmPayment = async () => {
    if (!user?.email || !referralCode.trim()) {
      toast.error("Please enter a referral code.");
      return;
    }

    setIsPaying(true);

    try {
      const formattedCode = referralCode.trim().toUpperCase();

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        activated: true,
        referralCode: formattedCode,
      });

      toast.success("Payment confirmed! You're now activated.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Activate Your Account</h1>

      <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md text-left">
        <p className="mb-4 text-sm text-gray-400">
          Send ₵100 via Bitcoin or MoMo to activate your account. Then, enter your referral code to continue.
        </p>

        {/* Bitcoin Option */}
        <h2 className="text-xl font-semibold mt-4 mb-2 text-white">Option 1: Bitcoin (BTC)</h2>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?data=bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8&size=150x150"
          alt="BTC QR"
          className="w-40 h-40 mb-2"
        />
        <p className="text-sm break-all">
          Wallet: <strong>bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8</strong>
        </p>

        {/* MoMo Option */}
        <h2 className="text-xl font-semibold mt-6 mb-2 text-white">Option 2: MoMo (Ghana)</h2>
        <p>Name: <strong>KwikEarn Ghana</strong></p>
        <p>Number: <strong>0539940558</strong></p>

        {/* Referral Code Input */}
        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code"
          className="w-full p-2 mt-6 mb-4 rounded bg-gray-800 border border-yellow-500 text-white"
        />

        {/* Confirm Payment Button */}
        <button
          onClick={confirmPayment}
          className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 rounded font-bold text-black"
          disabled={isPaying}
        >
          {isPaying ? "Confirming..." : "✅ I've Paid – Continue"}
        </button>
      </div>
    </div>
  );
}
