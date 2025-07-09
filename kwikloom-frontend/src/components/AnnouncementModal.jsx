// src/components/AnnouncementModal.jsx
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
    }, 10000); // ⏱️ Auto-close after 10,000ms = 10s

    return () => clearTimeout(timer); // Cleanup if unmounted early
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="relative bg-gradient-to-b from-[#007bff] to-[#002366] text-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-md border border-blue-300">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4">Announcement</h2>

        {/* Message */}
        <div className="border border-white p-4 rounded-md text-sm whitespace-pre-line leading-relaxed">
          {`Welcome to KwikLoom!

₵100 one-time activation gives you access to unlimited referral earnings.

💡 Here's how it works:

1️⃣ Pay ₵100 via Bitcoin to activate your account.  
2️⃣ Get your unique referral code after signing up.  
3️⃣ Share your code with friends to invite them.  
4️⃣ You earn ₵20 for each person who joins using your code.  
5️⃣ They can also start earning ₵20 per referral — just like you!

🌍 Invite unlimited people, earn unlimited ₵20 commissions. No hidden fees.

🚀 It's simple, secure, and fast.`}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-white text-blue-800 font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-100 transition"
            onClick={onClose}
          >
            I Know
          </button>
        </div>
      </div>
    </div>
  );
}
