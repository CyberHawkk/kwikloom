// src/pages/Check.jsx
import React, { useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const Check = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        navigate('/activate'); // Go to payment screen
      } else {
        alert('❌ Email not verified yet.');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p>⏳ Checking verification status...</p>
    </div>
  );
};

export default Check;
