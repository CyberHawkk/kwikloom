""// src/App.jsx

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import PhoneLogin from "./pages/PhoneLogin";
import Welcome from "./pages/Welcome";
import Landing from "./pages/Landing";
import Registration from "./pages/Registration";
import PhoneAuth from "./pages/PhoneAuth";
import Login from "./pages/Login";
import ConfirmCode from "./pages/ConfirmCode";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ActivatePage from "./pages/ActivatePage";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./pages/AdminDashboard";

import {
  auth,
  onAuthStateChanged,
  signOut,
} from "./firebase";
import { supabase } from "./supabase";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "@fontsource/orbitron";
import "@fontsource/sora";
import "@fontsource/inter";

import BackgroundParticles from "./components/BackgroundParticles";
import { motion } from "framer-motion";

function generateReferralCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "kwik-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
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

function ProtectedRoute({ children }) {
  const [hasPaid, setHasPaid] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkPayment = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setHasPaid(false);
        setChecking(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("payment_confirmed")
        .eq("email", currentUser.email.toLowerCase())
        .maybeSingle();

      setHasPaid(!error && data?.payment_confirmed === true);
      setChecking(false);
    };

    checkPayment();
  }, []);

  if (checking) {
    return (
      <div className="h-screen text-white flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  return hasPaid ? children : <Navigate to="/confirm-code" replace />;
}

function PersistentWelcomeBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-cyan-600 text-white p-3 z-50 flex justify-between items-center shadow-lg">
      <div>
        🎉 Welcome Aboard! ₵100 BTC activation. 💡 Get referral code, earn ₵20 per referral — no limits!
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 font-bold hover:text-yellow-300"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setReferralCode("");
        setIsAdmin(false);
        return;
      }

      setUser(currentUser);

      const { data } = await supabase
        .from("users")
        .select("referral_code, is_admin")
        .eq("email", currentUser.email.toLowerCase())
        .maybeSingle();

      if (data?.referral_code) setReferralCode(data.referral_code);
      if (data?.is_admin) setIsAdmin(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    toast.success("Logged out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sora text-white relative">
      <BackgroundParticles />
      <PersistentWelcomeBanner />

      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
        <BouncingBTC />
      </div>

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-code" element={<ConfirmCode />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/phonelogin" element={<PhoneLogin />} />
        <Route path="/phone-auth" element={<PhoneAuth />} />

        <Route
          path="/activate"
          element={
            user ? (
              user.emailVerified || user.phoneNumber ? (
                <ActivatePage />
              ) : (
                <Navigate to="/verify-email" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              user.emailVerified || user.phoneNumber ? (
                isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <ProtectedRoute>
                    <Dashboard
                      user={user}
                      referralCode={referralCode}
                      onLogout={handleLogout}
                    />
                  </ProtectedRoute>
                )
              ) : (
                <Navigate to="/verify-email" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AppContent />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default AppWrapper;