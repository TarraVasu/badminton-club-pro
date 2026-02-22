# 🐾 Birdie Beasts

[![Netlify Status](https://api.netlify.com/api/v1/badges/6999a90a-70b5-ee6c-c210-36b2/deploy-status)](https://app.netlify.com/sites/cute-jalebi-8a91b6/deploys)

A premium, full-stack management system for badminton clubs. Features include player rankings, match scheduling, session management, and a secure admin dashboard.

## 🚀 Features

- **🔐 Secure Authentication**: Industrial-grade login system with Django Token Auth.
- **📊 Real-time Dashboard**: Track club activity, revenue, and top players at a glance.
- **👥 Player Management**: Full CRUD with profile picture uploads and skill level tracking.
- **🏆 Leaderboard**: Automated ranking system with a winners' podium.
- **📅 Session Scheduling**: Manage court bookings and coaching sessions.
- **📱 Responsive UI**: Beautiful glassmorphism design that works on mobile and desktop.

---

## 🛠️ Tech Stack

- **Frontend**: Angular 16+, SCSS (Premium Glassmorphism Design).
- **Backend**: Django REST Framework (Python 3.11).
- **Database**: MongoDB (via Djongo).
- **Authentication**: Token-based Auth.

---

## 🌍 Deployment Guide (FREE)

### 1. Database (MongoDB Atlas)
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Get your connection string.
- In your hosting provider, set the environment variable: `MONGODB_URL=<your-atlas-url>`.

### 2. Backend (Render / Koyeb)
- **Repo**: Connect your GitHub repository.
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn badminton_backend.wsgi`
- **Root Directory**: `badminton-backend`

### 3. Frontend (Vercel / Netlify)
- **Repo**: Connect your GitHub repository.
- **Framework**: Angular.
- **Root Directory**: `badminton-app`
- **Build Command**: `ng build --configuration production`

---

## 👨‍💻 Local Setup

### Backend:
```bash
cd badminton-backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend:
```bash
cd badminton-app
npm install
ng serve
```

---

## 🛡️ License
MIT License - Created by [Tarra Vasu](https://github.com/TarraVasu)
