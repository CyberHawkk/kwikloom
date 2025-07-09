const BASE_URL = "https://KwikLoom-backend.onrender.com"; // Your deployed backend URL

export async function validateReferralCode(code) {
  const res = await fetch(`${BASE_URL}/api/validate-referral`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  return await res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
