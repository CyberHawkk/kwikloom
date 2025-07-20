import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BTC_ADDRESS = "bc1q0cncuzh44j7gac49vhgt9tccq7n6xh3u8j203z";
const BTC_QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${BTC_ADDRESS}`;

export default function Activate() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate("/login");
      } else {
        setUser(u);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleBack = () => navigate(-1);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch {
      toast.error("Failed to log out.");
    }
  };

  const handleBTCConfirm = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        paymentPending: true,
        paymentMethod: "BTC",
      });
      toast.success("BTC payment marked! We'll verify and activate your account.");
      navigate("/referral");
    } catch (error) {
      toast.error("Failed to update payment status.");
      console.error(error);
    }
  };

  const handlePaystack = () => {
    if (!window.PaystackPop || typeof window.PaystackPop.setup !== "function") {
      toast.error("Payment service unavailable. Try again later.");
      return;
    }

    setIsPaying(true);
    const handler = window.PaystackPop.setup({
      key: "pk_live_92827559758ed0247de9e74ca3b45a60a8077999",
      email: user.email,
      amount: 10000, // ₵100 in pesewas
      currency: "GHS",
      label: "KwikLoom Activation",
      channels: ["mobile_money"],
      callback: async (response) => {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            paymentPending: true,
            paymentMethod: "MoMo",
          });
          toast.success("MoMo payment complete! Verifying...");
          navigate("/referral");
        } catch (error) {
          console.error("Firestore error:", error);
          toast.error("Error saving payment status.");
        } finally {
          setIsPaying(false);
        }
      },
      onClose: () => {
        toast.error("Payment window closed.");
        setIsPaying(false);
      },
    });

    handler.openIframe();
  };

  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white px-4 py-6">
      {/* 🔙 Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 bg-white text-black rounded-full shadow-md hover:bg-gray-200 transition p-2"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mt-10">
        {/* Logout */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="text-red-400 hover:underline"
            aria-label="Logout"
          >
            Log Out
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Activate Your Account</h2>

        {/* Option 1: BTC */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Option 1: Pay with Bitcoin</h3>
          <p className="mb-2">
            Send exactly <strong>₵100 worth of BTC</strong> to the address below:
          </p>
          <img src={BTC_QR_IMAGE} alt="BTC QR Code" className="w-40 h-40 mb-2 mx-auto" />
          <code className="block bg-black text-green-400 p-2 rounded mb-4 break-all text-center">
            {BTC_ADDRESS}
          </code>
          <button
            onClick={handleBTCConfirm}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded w-full"
          >
            I’ve Paid with BTC
          </button>
        </div>

        <hr className="my-6 border-gray-700" />

        {/* Option 2: Paystack MoMo */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Option 2: MoMo (Paystack)</h3>
          <p className="mb-2">Instantly pay ₵100 via MTN, Vodafone, or AirtelTigo.</p>
          <button
            onClick={handlePaystack}
            disabled={isPaying}
            className={`w-full py-2 rounded text-white ${
              isPaying ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isPaying ? "Processing..." : "Pay with MoMo (via Paystack)"}
          </button>
        </div>
      </div>
    </div>
  );
}
