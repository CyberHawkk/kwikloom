import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { supabase } from "../supabase";

export default function PaymentCheckRedirect() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/register");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("payment_confirmed")
          .eq("email", currentUser.email.toLowerCase())
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", error);
          navigate("/confirm-code");
          return;
        }

        if (data?.payment_confirmed) {
          navigate("/dashboard");
        } else {
          navigate("/confirm-code");
        }
      } catch (err) {
        console.error("Error checking payment:", err);
        navigate("/confirm-code");
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-white text-center p-10 font-sora bg-black/90">
      <p className="animate-pulse text-cyan-300 text-sm">Checking payment status...</p>
    </div>
  );
}
