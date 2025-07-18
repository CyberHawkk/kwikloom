// src/utils/api.js
import { getAuth } from "firebase/auth";

export async function activateUser() {
  const auth = getAuth();
  const user = auth.currentUser;

  const res = await fetch("http://localhost:5000/api/activate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.uid }),
  });

  return res.json();
}
