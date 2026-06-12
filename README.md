# StudyNotes Hub

A production-ready notes selling platform where students can browse, purchase, and access study notes. Admins can upload and manage content with a full analytics dashboard.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Bootstrap 5 |
| Backend | Python Flask, Blueprints |
| Database | MongoDB Atlas |
| Auth | Google OAuth 2.0 |
| Payments | Razorpay |
| Deployment | Ubuntu VPS, Nginx, Gunicorn |

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in your values
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Configuration

Copy `backend/.env.example` to `backend/.env` and fill in:

- `MONGO_URI` — MongoDB Atlas connection string
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from Razorpay Dashboard
- `MAIL_USERNAME` / `MAIL_PASSWORD` — Gmail app password

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:5000/auth/callback` to authorized redirect URIs
4. Copy Client ID and Secret to `.env`

## Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com)
2. Get API keys from Dashboard → Settings → API Keys
3. Set up a webhook pointing to `/payments/webhook`

## Deployment

See `backend/deployment/setup.sh` for full Ubuntu VPS setup script.

```bash
# On your VPS
chmod +x backend/deployment/setup.sh
./backend/deployment/setup.sh
```

## Running Tests

```bash
cd backend
pip install pytest
python -m pytest tests/ -v
```

## Project Structure

```
studynotes/
├── backend/
│   ├── app.py              # Flask app factory
│   ├── config.py           # All config via env vars
│   ├── wsgi.py             # Gunicorn entry point
│   ├── requirements.txt
│   ├── database/           # MongoDB connection
│   ├── models/             # Data access layer
│   ├── routes/             # API blueprints
│   ├── middleware/         # Auth & access guards
│   ├── services/           # Email, PDF, Payment logic
│   ├── deployment/         # Nginx, Gunicorn, setup script
│   └── tests/              # Pytest test suite
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── context/        # Auth + Theme context
    │   ├── pages/          # public/, student/, admin/
    │   ├── components/     # Shared UI components
    │   ├── services/       # API calls (axios)
    │   ├── hooks/          # Custom React hooks
    │   ├── layouts/        # MainLayout, AdminLayout
    │   └── routes/         # Route guards
    └── vite.config.js
```

## Features

**Student:** Google login · Browse & search notes · Razorpay checkout · PDF access (watermarked) · Purchase history · Dark mode

**Admin:** Dashboard · Upload/edit/delete notes · Manage users & roles · View orders · Revenue chart

## Security

- PDF files are never served directly — always through Flask with purchase verification
- Each PDF is watermarked with the buyer's email
- Session cookies are HttpOnly and Secure in production
- Rate limiting via Flask-Limiter
- CSRF protection on all state-changing endpoints
