// src/components/AuthForm.jsx
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ isLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/verify");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/verify");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? "Login to KwikLoom" : "Register for KwikLoom"}
      </h2>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          {isLogin ? "Login with Email" : "Register with Email"}
        </button>
      </form>

      <div className="text-center my-4 text-gray-500 dark:text-gray-400">OR</div>

      <button
        onClick={handleGoogleAuth}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
      >
        Continue with Google
      </button>

      <button
        onClick={() => navigate("/phone-auth")}
        className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
      >
        Register with Phone 📱
      </button>
    </div>
  );
}
