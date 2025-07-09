// ✅ Firebase config and exports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfZrn9Xcn98BoFGwel0fhFo3Vvh14SxOY",
  authDomain: "KwikLoom-791b6.firebaseapp.com",
  projectId: "KwikLoom-791b6",
  storageBucket: "KwikLoom-791b6.appspot.com",
  messagingSenderId: "914137070167",
  appId: "1:914137070167:web:0bf0da04d741a89bf9c112",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
};
