import React from "react";

export default function Modal({ title, message, onClose }) {
  return (
    <div className="fixed top-8 left-0 right-0 z-50 flex justify-center items-start">
      <div className="relative w-[90%] max-w-md bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-2xl shadow-2xl p-5 animate-slideDown border border-blue-400">

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-lg font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-4">{title}</h2>

        {/* Message */}
        <div className="text-sm text-gray-100 whitespace-pre-wrap text-center mb-5 leading-relaxed">
          {message}
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow"
          >
            I Know
          </button>
        </div>
      </div>

      {/* Slide down animation */}
      <style jsx="true">{`
        @keyframes slideDown {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
