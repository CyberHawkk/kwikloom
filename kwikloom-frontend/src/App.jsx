// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

import Registration from "./components/Registration";
import Login from "./components/Login";
import Activate from "./components/Activate";
import ReferralStep from "./components/ReferralStep";
import Payment from "./pages/Payment";
import PaymentConfirm from "./pages/PaymentConfirm";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import Verify from "./pages/Verify";
import AdminDashboard from "./pages/AdminDashboard";

const ADMIN_EMAILS = ["qwikearn@gmail.com"]; // ✅ Admins skip activation

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setUserData(null);
        setCheckingAuth(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        const data = docSnap.exists() ? docSnap.data() : null;
        setUser(currentUser);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (checkingAuth) return <p className="text-center text-gray-200">Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  const FlowControl = () => {
    if (checkingAuth) return <p className="text-center text-gray-200">Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;

    if (ADMIN_EMAILS.includes(user.email)) return <Navigate to="/admin" replace />;
    if (!user.emailVerified) return <Navigate to="/verify-email" replace />;
    if (!userData) return <p className="text-center text-gray-200">Loading user data...</p>;
    if (!userData.isActivated) return <Navigate to="/activate" replace />;
    if (!userData.referralCodeConfirmed) return <Navigate to="/referral" replace />;

    return <Navigate to="/dashboard" replace />;
  };

  return (
    <div className="min-h-screen relative text-white font-[Rubik]">
      {/* 🌌 High-Tech Animated Background */}
      <div className="high-tech-bg" />

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-gray-100 border border-gray-600 px-4 py-2 rounded-full shadow hover:bg-opacity-70 transition-all duration-300 z-10"
      >
        ⬅ Back
      </button>

      <div className="px-4 py-8 relative z-10">
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {/* 🏁 Landing Page */}
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center justify-center text-gray-100">
                <h1 className="text-4xl neon-glow font-bold mb-6">🛫 Welcome to KwikLoom</h1>
                <p className="text-lg text-center max-w-xl mb-10 text-gray-300">
                  Play games, earn real cash, and invite friends to fly high with you! Start your hustle journey today.
                </p>
                <div className="w-full max-w-md bg-gray-900 border border-gray-700 text-gray-100 p-8 rounded-2xl shadow-2xl space-y-12">
                  <Registration />
                  <div className="border-t border-gray-600" />
                  <Login />
                </div>
              </div>
            }
          />

          {/* 🔄 Post-login flow router */}
          <Route path="/auth-flow" element={<FlowControl />} />

          {/* 🔓 Public Routes */}
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<Verify />} />

          {/* 🔐 Protected Routes */}
          <Route
            path="/activate"
            element={
              <ProtectedRoute>
                <Activate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/referral"
            element={
              <ProtectedRoute>
                <ReferralStep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/btc"
            element={
              <ProtectedRoute>
                <PaymentConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/momo"
            element={
              <ProtectedRoute>
                <PaymentConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <Games />
              </ProtectedRoute>
            }
          />

          {/* ✅ Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
