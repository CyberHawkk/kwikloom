// src/pages/Registration.jsx
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import AnnouncementModal from "../components/AnnouncementModal";
import "@fontsource/sora";
import "@fontsource/inter";
import "react-toastify/dist/ReactToastify.css";

export default function Registration() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bitcoin");

  const navigate = useNavigate();

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
  const ADMIN_EMAIL = "kwikearn@gmail.com";

  const animatedBtn =
    "w-full py-3 px-4 rounded-lg text-white font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-pink-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-[0_0_15px_rgba(0,255,255,0.7)]";

  const insertUserToSupabase = async (userData) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Not JSON response:", text);
        toast.error("Failed to save user");
        return;
      }

      await res.json();
    } catch (error) {
      console.error("Insert error:", error);
      toast.error("Failed to save user to database.");
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL;
      navigate(isAdmin ? "/admin" : "/confirm-code");
    } catch (err) {
      console.error("Firebase login error:", err.message);
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL;
      const referral_code = "kwik-" + user.uid.slice(-6);

      await insertUserToSupabase({
        email: user.email.toLowerCase(),
        name: user.displayName || "",
        referral_code,
        referred_by: "",
        country: "Google",
        payment_method: "Google",
        method: "Google",
        payment_confirmed: isAdmin,
        is_admin: isAdmin,
      });

      toast.success(`Welcome, ${user.displayName || user.email}`);
      navigate(isAdmin ? "/admin" : "/confirm-code");
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      toast.error("Google login failed");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return toast.error("Enter your email first");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("📩 Password reset email sent");
    } catch {
      toast.error("Failed to send reset link");
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!country || !paymentMethod) {
      toast.error("Please complete all fields");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.error("Email already in use. Try logging in.");
      setIsLogin(true);
      return;
    } catch {}

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL;
      const referral_code = "kwik-" + user.uid.slice(-6);

      await sendEmailVerification(user);
      toast.success("📩 Verification email sent. Please check your inbox.");

      await insertUserToSupabase({
        email: email.toLowerCase(),
        name,
        referral_code,
        referred_by: referralCode || null,
        country,
        payment_method: paymentMethod,
        method: "Email",
        payment_confirmed: isAdmin,
        is_admin: isAdmin,
      });

      navigate(isAdmin ? "/admin" : "/verify-email");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && <AnnouncementModal onClose={() => setShowModal(false)} />}
      <div className="max-w-xl mx-auto mt-10 bg-white/10 p-8 rounded-lg shadow-md backdrop-blur border border-cyan-500 text-white">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">
          {isLogin ? "🔐 Login to KwikLoom" : "🚀 Register for KwikLoom"}
        </h2>

        {isLogin ? (
          <>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-4 mb-2 bg-[#0f172a] border border-cyan-600 rounded"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-3 bg-[#0f172a] border border-cyan-600 rounded"
            />
            <button onClick={handleEmailLogin} className={animatedBtn}>
              🔐 Login
            </button>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-sm text-cyan-400 underline mt-2"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="mt-3 text-sm text-cyan-300 underline"
            >
              Don't have an account? Register
            </button>
          </>
        ) : (
          <form onSubmit={step === 1 ? handleInitialSubmit : handleFinalSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-cyan-600 rounded"
                />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-cyan-600 rounded"
                >
                  <option value="Bitcoin">Bitcoin</option>
                </select>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-cyan-600 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-cyan-600 rounded"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-cyan-600 rounded"
                />
                <input
                  type="text"
                  placeholder="Referral Code (optional)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-cyan-600 rounded"
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${animatedBtn} ${loading && "opacity-60 cursor-not-allowed"}`}
            >
              {loading ? "Please wait..." : step === 1 ? "Next Step →" : "✅ Register Now"}
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-sm text-cyan-300 underline"
              >
                ← Back
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="w-full py-2 mt-2 text-sm text-cyan-300 underline"
            >
              Already have an account? Login
            </button>
          </form>
        )}
      </div>
    </>
  );
}
