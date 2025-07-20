import React, { useState } from "react";
import { auth, db, provider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Registration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(user, { displayName: form.fullname });
      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullname: form.fullname,
        email: user.email,
        method: "email",
        emailVerified: false,
      });

      toast.success("Verification email sent. Check your inbox.");
      navigate("/verify");
    } catch (err) {
      console.error("Email signup error:", err.message);
      toast.error("Signup failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullname: user.displayName,
        email: user.email,
        method: "google",
        emailVerified: user.emailVerified,
      });

      toast.success("Signed in with Google!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Sign-In error:", err.message);
      toast.error("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">
      <form
        onSubmit={handleEmailSignup}
        className="card w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl space-y-5 backdrop-blur"
      >
        <h2 className="text-2xl font-bold text-center text-gray-100 neon-glow">
          🚀 Register for KwikLoom
        </h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={form.fullname}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pr-10 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={form.password}
            onChange={handleChange}
            required
          />
          <div
            className="absolute right-3 top-3 cursor-pointer text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold py-2 rounded-lg hover:scale-105 transition-all duration-300"
        >
          {loading ? "Registering..." : "✅ Register with Email"}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-3 text-gray-400">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full bg-gray-800 text-white border border-gray-700 flex items-center justify-center py-2 rounded-lg hover:bg-gray-700 transition"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:text-cyan-300 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
