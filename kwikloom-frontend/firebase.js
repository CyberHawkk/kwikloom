// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ KwikLoom Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK7KiOjPunYb1fuBCKn7MmZq_cHRDC4Xk",
  authDomain: "kwikloom.firebaseapp.com",
  projectId: "kwikloom",
  storageBucket: "kwikloom.firebasestorage.app",
  messagingSenderId: "471252667552",
  appId: "1:471252667552:web:713075e1fc7a4dfec40dc5",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// ✅ Export Firebase services
export { auth, provider, db };
