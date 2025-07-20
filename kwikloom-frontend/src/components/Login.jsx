import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import BackButton from "../components/BackButton";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("🎉 Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullname: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        method: "google",
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
      });

      toast.success("🎉 Logged in with Google!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("❌ Google login failed.");
    }
  };

  const handlePasswordReset = async () => {
    if (!form.email) {
      toast.error("Please enter your email to reset password.");
      return;
    }

    try {
      setResetting(true);
      await sendPasswordResetEmail(auth, form.email);
      toast.success("📩 Password reset email sent!");
    } catch (error) {
      toast.error("❌ Failed to send reset email. " + error.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-[0_0_60px_rgba(0,255,255,0.1)] space-y-6 animate-fadeIn">
        <BackButton />

        <h2 className="text-3xl font-bold text-center text-cyan-400 drop-shadow-lg">
          🔐 Login to KwikLoom
        </h2>

        <form onSubmit={handleLogin} className="space-y-4 text-gray-100">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          <div className="flex justify-between text-sm mt-1">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-cyan-400 hover:underline"
              disabled={resetting}
            >
              {resetting ? "Sending..." : "Forgot password?"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-md"
          >
            {loading ? "Logging in..." : "✅ Login"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-700" />
          <span className="mx-3 text-gray-500 font-medium">or</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-gray-800 text-white border border-gray-700 flex items-center justify-center py-2 rounded-lg hover:bg-gray-700 transition"
        >
          <FcGoogle size={20} className="mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
