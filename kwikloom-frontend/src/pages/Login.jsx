// src/pages/Login.jsx
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { toast } from "react-toastify";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import QRCode from "react-qr-code";
import { ArrowLeft } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/sora";
import "@fontsource/inter";

const ADMIN_EMAIL = "qwikearn@gmail.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const isAdmin = currentUser.email.toLowerCase() === ADMIN_EMAIL;

        if (isAdmin) {
          await supabase.from("users").upsert(
            {
              email: currentUser.email.toLowerCase(),
              is_admin: true,
              payment_confirmed: true,
            },
            { onConflict: "email" }
          );
        }

        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("email", currentUser.email.toLowerCase())
          .maybeSingle();

        if (data) setUserData(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Fill in all fields");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL;

      if (isAdmin) {
        await supabase.from("users").upsert(
          {
            email: user.email.toLowerCase(),
            is_admin: true,
            payment_confirmed: true,
          },
          { onConflict: "email" }
        );
        toast.success("Welcome Admin!");
        return navigate("/admin");
      }

      const { data, error } = await supabase
        .from("users")
        .select("payment_confirmed")
        .eq("email", user.email.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Failed to fetch user data.");
        return;
      }

      if (data?.payment_confirmed) {
        toast.success(`Welcome back, ${user.email}`);
        navigate("/dashboard");
      } else {
        toast.success("Login successful. Please confirm your payment.");
        navigate("/confirm-code");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) return toast.error("Google Sign-In failed to return a user.");

      const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL;

      await supabase.from("users").upsert(
        {
          email: user.email.toLowerCase(),
          referral_code: "kwik-" + user.uid.slice(-6),
          referred_by: "",
          payment_confirmed: isAdmin ? true : false,
          is_admin: isAdmin,
          phone: "",
        },
        { onConflict: "email" }
      );

      toast.success(`Welcome, ${isAdmin ? "Admin" : user.displayName || user.email}`);
      navigate(isAdmin ? "/admin" : "/confirm-code");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google Sign-In failed.");
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

  const confirmPayment = async () => {
    if (!user?.email || !referralCode.trim()) {
      toast.error("Missing referral code or user.");
      return;
    }

    try {
  const res = await fetch("https://kwikloom-backend.onrender.com/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          referralCode: referralCode.trim(),
          txid: "btc-kwikloom-txid",
          amount: 100,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Payment confirmed & ₵20 bonus sent!");
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Payment confirmation failed.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center px-4 relative">
      <button
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
        className="absolute top-6 left-6 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 font-medium transition"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="w-full max-w-lg bg-white/10 p-6 rounded-xl border border-cyan-400 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-cyan-300">🎉 Welcome to KwikLoom</h1>
        <p className="text-sm text-gray-300">
          A secure, student-driven, crypto-powered referral platform.
        </p>
        <QRCode
          value="bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8"
          size={140}
          bgColor="#fff"
          className="mx-auto"
        />
        <p className="text-yellow-400 font-mono text-sm">
          bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full mt-3 px-4 py-2 bg-[#0f172a] rounded border border-cyan-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full mt-3 px-4 py-2 bg-[#0f172a] rounded border border-cyan-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center gap-2 mt-2 text-sm text-cyan-200">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 font-bold"
        >
          {loading ? "Logging in..." : "🔐 Login"}
        </button>

        {/* ✅ Google Sign-In with icon */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-2 mt-3 bg-white text-slate-800 font-semibold rounded shadow hover:bg-slate-100 transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p
          onClick={handlePasswordReset}
          className="text-sm text-cyan-300 underline mt-3 cursor-pointer"
        >
          🔁 Forgot Password?
        </p>

        <p className="text-sm text-white">
          📝 Don’t have an account?{" "}
          <Link to="/register" className="underline text-cyan-300">
            Register
          </Link>
        </p>

        {user && userData?.payment_confirmed === false && (
          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter Referral Code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-4 py-2 bg-[#0f172a] border border-yellow-500 text-white rounded"
            />
            <button
              onClick={confirmPayment}
              className="w-full mt-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold rounded hover:from-yellow-600 hover:to-orange-500"
            >
              ✅ I’ve Paid & Entered Referral Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
