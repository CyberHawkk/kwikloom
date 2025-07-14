📄 README.md content (you can paste this directly):
md
# 💸 KwikLoom

**KwikLoom** is a modern, referral-based commission platform where users pay ₵100 via Bitcoin to join, and earn ₵20 per successful referral. It's built as a full-stack web app with:

- 💻 **Frontend**: React + Tailwind CSS
- 🧠 **Backend**: Express + Supabase
- 🔐 **Auth**: Firebase Google Login
- 💸 **Payment**: Bitcoin address with QR and payment confirmation

---

## 🚀 Features

- 🔐 User authentication (Google Sign-In)
- 💵 ₵100 BTC pay-to-join system
- 🤝 Referral system with unique codes
- 📲 Payment confirmation step
- 🎨 Animated, modern UI (Sora & Inter fonts)
- 📈 Balance tracking + referral count

---

## 📂 Folder Structure

kwikloom/
├── kwikloom-frontend/ # React + Tailwind client
├── kwikloom-backend/ # Node + Express API
├── .gitignore
├── package.json (for backend)

yaml

---

## ⚙️ Tech Stack

| Layer        | Tech Stack                         |
|--------------|-------------------------------------|
| Frontend     | React, Tailwind CSS, Vite           |
| Backend      | Express.js, Supabase                |
| Auth         | Firebase (Google Sign-In)           |
| Payment      | Bitcoin Wallet QR                   |
| Deployment   | Vercel (Frontend), Render (Backend) |

---

## 🧾 How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/CyberHawkk/kwikloom.git
cd kwikloom
cd kwikloom-frontend
npm install
npm run dev
cd ../kwikloom-backend
npm install
npm start
⚠️ You’ll need .env files for both frontend and backend with Firebase + Supabase keys.
🔑 Environment Variables
📁 kwikloom-frontend/.env
ini
Copy code
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=...
📁 kwikloom-backend/.env
ini
Copy code
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_KEY=your_secret_key
🧠 Future Ideas
💳 Add Lightning Network support

📊 User leaderboard

💬 Real-time chat support

📱 Mobile-friendly PWA

🛡️ Security
Firebase and Supabase keys kept in .env (not committed)

User authentication required to access dashboards

Backend validation for referrals and payments

👤 Author
Built with ❤️ by CyberHawk
Contact: cyberhawk.gh1@gmail.com
📃 License
MIT License

---

### ✅ To add this:

1. In your terminal:

```bash
cd C:\Users\LENOVO\OneDrive\Desktop\kwikloom
notepad README.md
Paste the full content above and save.

Then in terminal:

bash
Copy code
git add README.md
git commit -m "📝 Add professional README"
git push

