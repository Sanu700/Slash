# 🎯 Slash Experiences

> **A full-stack experience gifting platform.** Discover, book, and gift curated experiences across India — from adventure activities to wellness retreats.

![Slash](https://img.shields.io/badge/Slash-v1.0.0-ff6b6b?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00c7b7?style=flat-square&logo=netlify)

---

## 🌐 Live Demo

🚀 **[slashexperiences.in](https://slashexperiences.in)**

---

## ✨ Features

- 🔍 **Smart Search** — Autocomplete across experience titles, locations, and categories
- 💳 **End-to-end Payments** — Razorpay integration with 35% improved transaction success rate
- 👤 **Personalized Profiles** — Social features including Connect, Viewed, Liked, and History
- 📍 **Location Browsing** — Explore experiences across 200+ Indian cities
- 🛠️ **Admin Dashboard** — Manage experiences, suppliers, and bookings
- ⚡ **Optimized Performance** — 25% faster page load, 20% higher user engagement
- 📱 **Mobile-first** — Fully responsive across all screen sizes
- 🔐 **Secure Auth** — Supabase authentication with session management

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Razorpay account (for payments)

### Installation

```bash
git clone https://github.com/Sanu700/Slash.git
cd Slash
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Project Structure

```
Slash/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page-level components
│   ├── contexts/           # React context (auth, cart, user)
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Supabase client, utilities
├── netlify/
│   └── functions/          # Serverless payment functions
├── supabase/
│   └── migrations/         # Database schema and migrations
├── public/                 # Static assets
└── package.json
```

---

## 📊 Impact

| Metric | Result |
|--------|--------|
| Active Users | 1,000+ |
| Uptime | 99.9% |
| Payment Success Rate | +35% improvement |
| Page Load Time | -25% reduction |
| User Engagement | +20% increase |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Payments | Razorpay |
| Functions | Netlify Serverless Functions |
| Deployment | Netlify |

---

## 🚀 Deployment

- Frontend → [Netlify](https://netlify.com) (auto-deploys on push to main)
- Backend → Supabase (managed PostgreSQL)
- Configure environment variables in Netlify dashboard

---

## 📄 License

GPL-3.0 — see [LICENSE](LICENSE) for details.
