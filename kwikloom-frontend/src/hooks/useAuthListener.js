// src/hooks/useAuthListener.js
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const useAuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ Check if verified
        if (
          (user.email && user.emailVerified) ||
          (user.phoneNumber && user.phoneNumber.length > 0)
        ) {
          // 🎯 Verified → go to activate page
          navigate("/activate");
        } else {
          // 🚧 Not verified → show verification screen
          navigate("/verify");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);
};

export default useAuthListener;
