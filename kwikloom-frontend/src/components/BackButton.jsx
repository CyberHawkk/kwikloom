// BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Optional icon library

export default function BackButton({ fallback = "/", label = "Back", className = "" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 text-cyan-400 hover:underline ${className}`}
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </button>
  );
}
