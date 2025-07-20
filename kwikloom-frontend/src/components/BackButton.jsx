// src/components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react"; // Optional: Replace with IoArrowBack if preferred

export default function BackButton({ label = "Back", className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-full shadow-lg transition-all duration-300 ${className}`}
    >
      <ArrowLeftCircle className="w-5 h-5" />
      {label}
    </button>
  );
}
