import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("✅ Password reset email sent.");
    } catch (error) {
      toast.error("Error sending reset email.");
      console.error("Reset error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white/10 p-6 rounded-lg border border-cyan-500 shadow-md backdrop-blur">
      <h2 className="text-2xl font-bold mb-4 text-cyan-300">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-[#0f172a] border border-cyan-600 rounded text-white"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
