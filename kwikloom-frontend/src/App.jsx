import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "./firebase";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/orbitron";
import "@fontsource/sora";
import "@fontsource/inter";
import { motion } from "framer-motion";
import BackgroundParticles from "./components/BackgroundParticles";

function AppWrapper() {
  return (
    <Router>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

function BouncingBTC() {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      className="flex justify-center mb-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-10 h-10 text-yellow-400 drop-shadow-lg"
        fill="currentColor"
      >
        <circle cx="16" cy="16" r="16" fill="#f7931a" />
        <path
          fill="#fff"
          d="M21.59 14.503c.256-1.709-1.05-2.623-3.2-3.23l.654-2.628-1.595-.396-.64 2.57c-.422-.106-.86-.208-1.287-.313l.642-2.58-1.593-.395-.654 2.626a72.5 72.5 0 0 0-1.407-.34l-.01-.04-3.213-.796-.62 2.492s1.725.39 1.69.418c.94.235 1.11.853 1.083 1.346l-1.087 4.37c.064.016.147.038.238.072-.074-.02-.162-.042-.253-.07l-.61 2.45 1.582.393.612-2.498c.405.1.8.192 1.19.286l-.615 2.474 1.594.396.61-2.484c2.523.495 4.42.296 5.217-1.996.536-1.518-.026-2.394-1.04-2.96.738-.168 1.298-.662 1.447-1.663zm-3.245 3.52c-.434 1.74-3.363.8-4.348.59l.77-3.095c.985.206 3.944.492 3.578 2.505zm.438-4.048c-.395 1.59-3.137.789-4.003.6l.686-2.75c.865.185 3.654.429 3.317 2.15z"
        />
      </svg>
    </motion.div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const navigate = useNavigate();
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      toast.success(`Welcome ${result.user.displayName || result.user.email}`);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Email login failed: " + error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    toast.info("Logged out successfully.");
    navigate("/");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const theme = darkMode ? "text-white" : "text-gray-800";

  return (
    <div
      className={`min-h-screen font-inter relative ${theme} bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]`}
    >
      <BackgroundParticles />

      <div className="absolute top-4 right-4 z-50 flex flex-col items-center">
        <BouncingBTC />
        <button
          className="px-4 py-1 border border-cyan-500 text-cyan-300 bg-black/20 rounded text-sm shadow-md hover:bg-cyan-500/10"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {showAnnouncement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-8 py-6 rounded-xl shadow-2xl z-50 w-[90%] max-w-xl text-center border border-cyan-400 backdrop-blur-md"
        >
          <h2 className="text-2xl font-bold font-orbitron text-cyan-400 mb-4 tracking-wide">
            Welcome to KwikLoom!
          </h2>
          <p className="text-lg leading-relaxed font-sora space-y-3">
            <span>Activate your account with a one-time ₵100 BTC payment.</span>
            <br />
            <span>Receive your unique referral code instantly.</span>
            <br />
            <span>Earn ₵20 commission for every successful referral.</span>
            <br />
            <span>
              Secure, blockchain-powered platform designed for students and entrepreneurs.
            </span>
            <br />
            <span className="text-yellow-300 text-sm italic block mt-3">
              *Please note: Only payments sent to the official BTC wallet address are valid.
            </span>
          </p>

          <button
            onClick={() => setShowAnnouncement(false)}
            className="mt-5 text-sm underline text-cyan-300 hover:text-cyan-500 transition"
          >
            Dismiss Message
          </button>
        </motion.div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-screen flex items-center justify-center p-4 z-10 relative"
              >
                <div className="relative w-full max-w-xl rounded-3xl bg-white/5 border border-cyan-500 backdrop-blur-xl shadow-2xl p-10 text-center font-orbitron">
                  <div className="flex flex-col items-center mb-6 space-y-3 animate-bounce">
                    {/* Neon SVG Logo */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 64 64"
                      className="w-20 h-20"
                    >
                      <defs>
                        <filter
                          id="glow"
                          x="-50%"
                          y="-50%"
                          width="200%"
                          height="200%"
                          colorInterpolationFilters="sRGB"
                        >
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="2"
                            floodColor="#06b6d4"
                            floodOpacity="0.9"
                          />
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="5"
                            floodColor="#0ea5e9"
                            floodOpacity="0.7"
                          />
                        </filter>
                      </defs>

                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        fill="none"
                        filter="url(#glow)"
                      />
                      <path
                        d="M20 20 L44 44 M44 20 L20 44"
                        stroke="#0ea5e9"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />
                    </svg>
                  </div>

                  <h1 className="text-4xl font-bold text-cyan-300 mb-2 tracking-widest">
                    KwikLoom
                  </h1>
                  <p className="text-sm text-white mb-6">
                    🚀 One-time BTC activation. Earn ₵20 per referral.
                  </p>

                  <button
                    onClick={handleLogin}
                    className="w-full py-3 mb-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white font-bold tracking-wide transition shadow-lg"
                  >
                    Sign In with Google
                  </button>

                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-cyan-200 hover:underline">
                      Use Email/Password Instead
                    </summary>
                    <div className="mt-4 space-y-3">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1a1f33] border border-cyan-700 text-white rounded-lg focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1a1f33] border border-cyan-700 text-white rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={handleEmailLogin}
                        className="w-full py-2 rounded-lg bg-cyan-400 hover:bg-cyan-600 text-white font-semibold"
                      >
                        Login with Email
                      </button>
                      <button
                        onClick={handleResetPassword}
                        className="text-xs underline text-cyan-400"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </details>

                  <div className="mt-10 text-left text-sm text-white space-y-4">
                    <h2 className="text-lg font-semibold text-cyan-300">
                      📦 How to Join KwikLoom
                    </h2>
                    <div className="bg-black/30 p-4 rounded-lg border border-cyan-500">
                      <p className="mb-2">
                        💸 To activate your account, send ₵100 worth of BTC to:
                      </p>
                      <div className="bg-[#0d1b2a] p-3 rounded-lg overflow-x-auto text-center">
                        <p className="text-cyan-400 text-xs mb-2">
                          Official BTC Wallet Address:
                        </p>
                        <p className="font-mono break-all text-yellow-400 text-sm">
                          bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8
                        </p>
                      </div>
                      <div className="flex justify-center my-4">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?data=bc1qzllw832k6m6p5mk9tzp2pv3ys66sw6tta2w4u8&size=150x150"
                          alt="BTC QR Code"
                          className="rounded-lg border border-cyan-400 shadow-lg"
                        />
                      </div>
                      <p className="text-xs text-yellow-300 italic mb-2">
                        *Your activation will be confirmed after payment and
                        referral verification.
                      </p>
                      <div className="mt-4 space-y-2">
                        <label
                          htmlFor="referral"
                          className="block text-cyan-200 font-medium"
                        >
                          Enter Referral Code (if any)
                        </label>
                        <input
                          type="text"
                          id="referral"
                          placeholder="e.g., kwik-zy8a2"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          className="w-full px-4 py-2 bg-[#0c1323] border border-cyan-700 text-white rounded-lg focus:outline-none"
                        />
                        <button
                          className="w-full py-2 mt-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 rounded-lg text-white font-bold shadow"
                        >
                          ✅ I’ve Paid & Entered Referral Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <div className="relative z-10 py-10 font-sora">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-bold font-orbitron text-cyan-400">
                    Hello, {user.displayName || user.email}
                  </h2>
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-20 h-20 rounded-full mx-auto border-4 border-cyan-400 shadow"
                    />
                  )}
                  <button onClick={handleLogout} className="neon-btn-alt mt-3">
                    Logout
                  </button>
                </div>
                <Dashboard />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
