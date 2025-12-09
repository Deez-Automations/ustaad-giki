<p align="center">
  <img src="public/logo.png" alt="USTAAD GIKI Logo" width="120" />
</p>

<h1 align="center">USTAAD GIKI 🎓</h1>

<p align="center">
  <strong>Smart Peer Tutoring Platform for GIKI Students</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a>
</p>

---

## 📖 About

**USTAAD GIKI** (*Urdu for "Teacher"*) is an intelligent peer-to-peer tutoring platform designed exclusively for **Ghulam Ishaq Khan Institute (GIKI)** students. It connects students seeking academic help with qualified senior peers who can mentor them — all within the trusted GIKI ecosystem.

### 🎯 The Problem We Solve

- Students struggle to find reliable tutors for specific courses
- No centralized system for peer tutoring at GIKI
- Scheduling conflicts between students and mentors
- Last-minute assignment help is hard to find

### 💡 Our Solution

USTAAD GIKI provides:
- **Smart Timetable Matching** — Book sessions when both you and your mentor are free
- **OCR Timetable Upload** — Just snap your timetable, we extract it automatically
- **SOS Alerts** — Urgent help requests for last-minute deadlines
- **Verified GIKI Community** — Only @giki.edu.pk emails allowed

---

## ✨ Features

### For Students
| Feature | Description |
|---------|-------------|
| 🔍 **Find Mentors** | Search by course, department, rating & price |
| 📅 **Smart Booking** | Only shows times when both parties are free |
| 📸 **OCR Timetable** | Upload timetable image → auto-extract schedule |
| 🆘 **SOS Alerts** | Broadcast urgent help requests to all mentors |
| 📊 **Dashboard** | Track bookings, upcoming sessions, wallet balance |

### For Mentors
| Feature | Description |
|---------|-------------|
| 💰 **Earn Money** | Set your own hourly rate (PKR 500-1000) |
| 📬 **Booking Requests** | Accept or decline with one click |
| 📈 **Analytics** | Track earnings, sessions, ratings |
| ⚡ **SOS Opportunities** | Get double rate for urgent requests |
| ⭐ **Build Reputation** | Collect reviews and improve your rating |

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Turso (Cloud SQLite) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js |
| **AI/OCR** | Groq Vision API |
| **Animations** | Framer Motion |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Turso database (or local SQLite)

### Installation

```bash
# Clone the repository
git clone https://github.com/Deez-Automations/ustaad-giki.git
cd ustaad-giki

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Initialize the database
npx tsx scripts/sync-turso-schema.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
DATABASE_URL=           # Turso database URL
TURSO_AUTH_TOKEN=       # Turso auth token
AUTH_SECRET=            # NextAuth secret (generate with: openssl rand -base64 32)
GROQ_API_KEY=           # Groq API key for OCR
```

---

## 📁 Project Structure

```
ustaad-giki/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── student/        # Student dashboard
│   │   │   ├── mentor/         # Mentor dashboard
│   │   │   └── timetable/      # Timetable management
│   │   ├── auth/               # Authentication pages
│   │   └── mentors/            # Mentor search page
│   ├── actions/                # Server actions
│   │   ├── booking-actions.ts  # Booking & timetable matching
│   │   ├── register.ts         # User registration
│   │   └── sos-actions.ts      # SOS alert system
│   ├── components/             # React components
│   │   ├── booking/            # Booking modal & pending requests
│   │   ├── home/               # Landing page components
│   │   ├── mentor/             # Mentor dashboard components
│   │   └── timetable/          # Timetable upload & calendar
│   └── lib/                    # Utilities & config
├── prisma/                     # Database schema
└── scripts/                    # Database initialization scripts
```

---

## 🔐 Security

- ✅ GIKI email verification (@giki.edu.pk only)
- ✅ CNIC validation for identity
- ✅ Password hashing with bcrypt
- ✅ JWT session tokens
- ✅ Environment variables for secrets

---

## 📄 License

This project is developed for **GIKI CS 391** coursework.

---

<p align="center">
  Made with ❤️ for GIKI Students
</p>
