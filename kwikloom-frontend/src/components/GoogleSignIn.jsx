import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "../styles/theme.css"; // Import your theme styles

const steps = [
  { icon: "💰", text: "Pay ₵100 one-time to activate your account." },
  { icon: "🔑", text: "Receive a unique referral code after signup." },
  { icon: "💵", text: "Earn ₵20 whenever someone joins using your code." },
  { icon: "♾️", text: "Refer unlimited people — earn ₵20 for each." },
  { icon: "🚀", text: "Everyone you refer can also start earning by sharing their own code." },
];

export default function GoogleSignIn({ onSignedIn }) {
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      onSignedIn(); // Notify parent component
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error(err);
    }
  };

  return (
    <main className="container" role="main" aria-label="Sign in screen">
      <section className="how-it-works" aria-label="How It Works">
        <h3>How It Works</h3>
        <ul>
          {steps.map(({ icon, text }, i) => (
            <li key={i}>
              <span className="icon" aria-hidden="true" style={{ color: "var(--color-accent)" }}>
                {icon}
              </span>{" "}
              {text}
            </li>
          ))}
        </ul>

        <button
          onClick={handleGoogleSignIn}
          className="google-auth-btn"
          type="button"
          aria-label="Sign in with Google"
        >
          <img
            src="/google-logo.png"
            alt="Google"
            style={{ width: 28, height: 28, filter: "drop-shadow(0 0 2px var(--color-accent))" }}
          />
          Sign in with Google
        </button>

        {error && <p role="alert" style={{ color: "var(--color-accent-dark)", marginTop: "1rem" }}>{error}</p>}
      </section>
    </main>
  );
}
