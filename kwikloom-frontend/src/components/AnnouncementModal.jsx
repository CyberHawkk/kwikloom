import React, { useEffect } from "react";

/**
 * AnnouncementModal
 * Auto-closing modal styled like KwikLoom's welcome popup.
 * Closes automatically after 10 seconds or when manually dismissed.
 */
export default function AnnouncementModal({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // Auto-close after 10 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="relative bg-gradient-to-b from-[#007bff] to-[#002366] text-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-md border border-blue-300">
        
        {/* ❌ Close Button */}
        <button
          className="absolute top-3 right-3 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* 🚀 Title */}
        <h2 className="text-2xl font-bold text-center mb-4">🎉 Welcome Aboard!</h2>

        {/* 💬 Message Body */}
        <div className="border border-white p-4 rounded-md text-sm whitespace-pre-line leading-relaxed">
          {`Kickstart your journey with a one-time ₵100 BTC activation.

💡 Get your referral code instantly  
💰 Earn ₵20 per referral — no limits  
🌐 Built for young hustlers & smart earners

⛔ Only send BTC to the official wallet to avoid fraud.`}
        </div>

        {/* ✅ Dismiss Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-white text-blue-800 font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-100 transition"
            onClick={onClose}
          >
            Dismiss Message
          </button>
        </div>
      </div>
    </div>
  );
}
