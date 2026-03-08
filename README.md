# MovieStream – Full-Stack Movie Discovery Platform

A production-level movie streaming platform built with **React**, **Redux Toolkit**, **Node.js/Express**, **MongoDB**, and the **TMDB API**. Deployable to **Vercel** with frontend + backend on the same domain.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Redux Toolkit, React Router, Framer Motion, Tailwind CSS v4 |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), JWT Authentication |
| **API** | TMDB (The Movie Database) for movie data |
| **Deployment** | Vercel (serverless) |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB ([MongoDB Atlas](https://cloud.mongodb.com/) — free tier)
- TMDB API Key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### 1. Clone & Install

```bash
git clone https://github.com/Akshvt/Noir.git
cd Noir

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment Variables

Copy the example files and fill in your values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/moviestream
JWT_SECRET=your_random_secret_string
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Run Locally

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Frontend
cd frontend && npm run dev
```

Open http://localhost:5173

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel
```

In Vercel Dashboard, add environment variables:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — your JWT secret
- `NODE_ENV` — `production`
- `VITE_TMDB_API_KEY` — your TMDB API key
- `VITE_TMDB_BASE_URL` — `https://api.themoviedb.org/3`
- `VITE_TMDB_IMAGE_BASE` — `https://image.tmdb.org/t/p`

## Features

### Core
- 🎬 Home Feed — Hero spotlight, trending/popular/top-rated rows
- 🔍 Real-Time Search — Debounced (300ms), categorized results
- 📺 Movie Details — Backdrop, cast, media gallery, similar movies
- 🎥 Trailer Modal — YouTube embed with fallback
- ♾️ Infinite Scroll — Browse all movies

### Authentication
- 🔐 JWT Auth with HttpOnly cookies
- 👤 Protected routes for favorites and history

### User Features
- ❤️ Favorites — Add/remove, persisted in database
- 📜 Watch History — Auto-logged on movie visits
- 🌙 Dark cinema theme

### Admin Dashboard
- 📊 Stats overview
- 🎞️ Movie CRUD
- 👥 User management (ban/delete)

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout |
| GET | `/api/auth/profile` | Yes | Get profile |
| GET | `/api/movies` | No | List movies |
| POST | `/api/movies` | Admin | Create movie |
| PUT | `/api/movies/:id` | Admin | Update movie |
| DELETE | `/api/movies/:id` | Admin | Delete movie |
| GET | `/api/favorites` | Yes | List favorites |
| POST | `/api/favorites` | Yes | Add favorite |
| DELETE | `/api/favorites/:tmdbId` | Yes | Remove favorite |
| GET | `/api/watch-history` | Yes | Get history |
| POST | `/api/watch-history` | Yes | Add to history |
| GET | `/api/users` | Admin | List users |
| PATCH | `/api/users/:id/ban` | Admin | Ban/unban |
| DELETE | `/api/users/:id` | Admin | Delete user |

## Project Structure

```
moviestream/
├── api/index.js          ← Vercel serverless entry
├── vercel.json           ← Vercel config
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   └── server.js         ← Express app (serves frontend in prod)
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── pages/
│       ├── store/
│       └── utils/
└── .gitignore
```
