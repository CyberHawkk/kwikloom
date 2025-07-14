import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// ✅ KwikLoom Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK7KiOjPunYb1fuBCKn7MmZq_cHRDC4Xk",
  authDomain: "kwikloom.firebaseapp.com",
  projectId: "kwikloom",
  storageBucket: "kwikloom.firebasestorage.app",
  messagingSenderId: "471252667552",
  appId: "1:471252667552:web:713075e1fc7a4dfec40dc5",
};

// ✅ Prevent reinitialization on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ✅ Export everything needed
export {
  auth,
  db,
  provider,
  signInWithRedirect,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
};
