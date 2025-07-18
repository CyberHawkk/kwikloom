// src/firebase.js

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCK7KiOjPunYb1fuBCKn7MmZq_cHRDC4Xk",
  authDomain: "kwikloom.firebaseapp.com",
  projectId: "kwikloom",
  storageBucket: "kwikloom.appspot.com", // fixed typo
  messagingSenderId: "471252667552",
  appId: "1:471252667552:web:713075e1fc7a4dfec40dc5",
};

// ✅ Initialize Firebase (avoid reinitialization on hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Firebase Services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Register with Email + Verification
export const registerWithEmail = async (fullName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    return {
      success: true,
      message: "✅ Verification email sent! Please check your inbox before logging in.",
    };
  } catch (error) {
    return { success: false, message: `❌ ${error.message}` };
  }
};

// ✅ Login with Email (only if verified)
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await signOut(auth); // force logout if not verified
      return {
        success: false,
        message: "❌ Please verify your email before logging in.",
      };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, message: `❌ ${error.message}` };
  }
};

// ✅ Login with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, message: `❌ ${error.message}` };
  }
};

// ✅ Send password reset email
export const sendResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "📨 Password reset email sent!" };
  } catch (error) {
    return { success: false, message: `❌ ${error.message}` };
  }
};

// ✅ Export Firebase Core + Helpers
export {
  app,
  auth,
  provider,
  signOut,
  signInWithPopup,            // ✅ make sure this is included!
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
};
