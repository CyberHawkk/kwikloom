// src/pages/Welcome.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { countries } from "../utils/countries";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdPhonePortrait } from "react-icons/io";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const Welcome = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/payment"); // Navigate after login
    } catch (err) {
      console.error(err);
      toast.error("Google Sign-In Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/payment"); // Navigate after registration
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center text-white px-4 py-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 text-white">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm hover:underline text-gray-200">
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-2xl font-bold text-center mb-2">🚀 Register for KwikLoom</h1>
        <p className="text-center text-sm text-gray-300 mb-6">
          Start your hustle journey with us!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
          />
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="referralCode"
            placeholder="Referral Code (optional)"
            value={formData.referralCode}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition"
          >
            ✅ Register Now
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleGoogle}
            className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded font-semibold"
          >
            Sign in with Google
          </button>

          <button
            onClick={() => navigate("/phonelogin")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-2"
          >
            <IoMdPhonePortrait className="text-xl" />
            Register with Mobile Number
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
