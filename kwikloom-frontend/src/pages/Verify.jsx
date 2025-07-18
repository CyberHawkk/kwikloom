// src/pages/VerifyScreen.jsx
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";

export default function VerifyScreen() {
  const [message, setMessage] = useState("");

  const resendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage("Verification email sent!");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-bold mb-2">🔐 Please Verify Your Email</h2>
      <p className="mb-4">
        Check your email inbox and click the verification link.
      </p>
      <button
        onClick={resendVerification}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Resend Email
      </button>
      {message && <p className="mt-3 text-sm text-green-500">{message}</p>}
    </div>
  );
}
