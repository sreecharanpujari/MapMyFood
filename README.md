# Map My Food — Discover India's Regional Food

> **"Explore a place. Discover its signature food. Find where to eat it."**

**Map My Food** is an interactive, full-stack web application designed to help people explore authentic regional cuisines and signature culinary creations across India. Rather than presenting generic menus, Map My Food grounds culinary discovery in geographic heritage—from the royal slow-cooked *dum* biryanis of Hyderabad to crispy fermented *dosas* of Chennai, golden coal-tandoor *kulchas* of Amritsar, and flaky *kathi rolls* of Kolkata.

---

## 1. Key Features

- **Interactive Geographic Discovery (Leaflet & OpenStreetMap)**:
  - Custom brand markers for Indian food hubs.
  - Interactive popups highlighting signature dishes and cultural background.
  - "Explore Food Near Me" with browser geolocation (explicit user consent requested; never required to browse).
  - Graceful offline and tile-fallback handling.
- **Rich Regional Culinary Catalog**:
  - Detailed dishes with origin, cultural history, spice intensity, dietary badges (Vegetarian / Non-Vegetarian), and key ingredients.
  - Separate modeling of cities, dishes, and curated eateries.
- **Honest Data Transparency & Integrity**:
  - Explicit distinction between verified culinary traditions and illustrative sample eatery data.
  - No fake reviews, artificial star ratings, or fabricated restaurant partnerships.
- **Dual-Mode Saved Favorites**:
  - **Guests**: Instant local bookmarking preserved in browser `localStorage`.
  - **Registered Explorers**: Saved securely to the database and synced across devices.
- **Authentication & Security**:
  - Secure registration, login, profile endpoints (`/api/auth/*`).
  - Cryptographic password hashing using PBKDF2-HMAC-SHA256 (200,000 iterations).
  - Stateless JWT token handling (`HS256`).
- **Responsive Editorial Design**:
  - Custom color palette: Warm Cream (`#FFF8EE`), Dark Brown (`#241A15`), Primary Orange (`#FF6B35`), Deep Green (`#138A72`).
  - Mobile, tablet, and desktop layout optimizations.
  - Accessible focus states, keyboard navigation, and subtle micro-interactions.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide Icons |
| **Mapping** | Leaflet, React-Leaflet, OpenStreetMap free tiles (no paid API keys required) |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0 |
| **Database** | SQLite (default local development), PostgreSQL compatible (production) |
| **Testing** | Pytest & HTTP test suite (backend), Vitest & React Testing Library (frontend) |

---

## 3. Project Structure

```
Map My Food/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routers (auth, cities, dishes, places, favorites, search)
│   │   ├── models/          # SQLAlchemy relational models (User, City, Dish, Place, Favorite)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── services/        # Auth & password hashing, database seeder
│   │   ├── config.py        # Settings & environment configuration
│   │   ├── database.py      # SQLAlchemy session and engine management
│   │   └── main.py          # FastAPI application entry point & CORS
│   ├── tests/
│   │   └── test_api.py      # Pytest API test suite
│   ├── Dockerfile           # Backend container build configuration
│   └── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (FoodCard, CityCard, InteractiveMap, Navbar, Footer, AuthModal)
│   │   ├── pages/           # Pages (HomePage, ExplorePage, DishesPage, DishDetailPage, DestinationsPage, etc.)
│   │   ├── hooks/           # useAuth and useFavorites context providers
│   │   ├── services/        # Fetch API client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── test/            # Vitest unit & integration tests
│   │   ├── App.tsx          # Main routing & application layout
│   │   └── main.tsx         # React DOM mount point
│   ├── public/              # Static assets (custom SVG brand logo)
│   ├── package.json         # Node scripts & dependencies
│   ├── tailwind.config.js   # Brand theme & palette configuration
│   ├── vite.config.ts       # Vite bundler & test configuration
│   └── vercel.json          # Single-Page-App rewrites for production hosting
├── run_api_tests.py         # End-to-end API test runner script
├── render.yaml              # Cloud deployment specification for Render + PostgreSQL
├── .env.example             # Example environment variables
├── .gitignore               # Excludes secrets, databases, and dependencies
└── README.md                # Documentation and setup instructions
```

---

## 4. Local Setup and Startup Commands (Windows)

### Prerequisites
- Python 3.11+
- Node.js (v18+) and npm

### Step 1: Clone or Navigate to the Workspace
```powershell
cd "c:\Users\sreec\Documents\Map My Food"
```

### Step 2: Set Up Backend
1. (Optional) Create a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
2. Install Python dependencies:
   ```powershell
   python -m pip install -r backend/requirements.txt
   ```
3. Initialize the database and run seed data (automatic on first server start, or test immediately):
   ```powershell
   python -c "from backend.app.database import engine, Base; from backend.app.models import *; Base.metadata.create_all(bind=engine); from backend.app.database import SessionLocal; from backend.app.services.seed import seed_database; db = SessionLocal(); seed_database(db); db.close()"
   ```
4. Start the FastAPI backend server:
   ```powershell
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - API is live at: `http://127.0.0.1:8000`
   - Interactive Swagger docs at: `http://127.0.0.1:8000/docs`

### Step 3: Set Up Frontend
In a new PowerShell window:
1. Navigate to the frontend directory:
   ```powershell
   cd "c:\Users\sreec\Documents\Map My Food\frontend"
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   - Open your browser to: `http://localhost:5173`

---

## 5. Running Automated Tests

### Backend Automated Test Suite
Run the full automated test suite verifying health, cities, dishes, search, auth, and favorites:
```powershell
python run_api_tests.py
```
Or run with pytest:
```powershell
python -m pytest backend/tests -v
```

### Frontend Automated Test Suite
Run Vitest and React Testing Library:
```powershell
cd frontend
npm test
```

### Production Build Verification
Verify TypeScript and Vite bundling:
```powershell
cd frontend
npm run build
```

---

## 6. API Documentation Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Health and connectivity check | No |
| `GET` | `/api/cities` | List supported cities (filter by `region`, `search`) | No |
| `GET` | `/api/cities/{id}` | City details with signature dishes & places | No |
| `GET` | `/api/dishes` | List regional dishes (filter by `cuisine`, `category`, `dietary`, `search`) | No |
| `GET` | `/api/dishes/{id}` | Full dish details, cultural history, ingredients | No |
| `GET` | `/api/places` | List sample eateries and food locations | No |
| `GET` | `/api/search?q=` | Unified search across dishes, cities, and cuisines | No |
| `POST` | `/api/auth/register`| Register new explorer account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT access token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |
| `GET` | `/api/favorites` | Retrieve user saved dishes and destinations | Yes (Bearer) |
| `POST` | `/api/favorites` | Save a dish (`dish_id`) or city (`city_id`) | Yes (Bearer) |
| `DELETE` | `/api/favorites/{id}` | Remove a favorite entry | Yes (Bearer) |

Interactive API exploration is available out-of-the-box at `http://127.0.0.1:8000/docs`.

---

## 7. Required Environment Variables

### Backend (`.env`)
| Variable | Description | Default |
|---|---|---|
| `ENVIRONMENT` | `development` or `production` | `development` |
| `DATABASE_URL` | SQLAlchemy database connection URI | `sqlite:///./map_my_food.db` |
| `SECRET_KEY` | Secret key for JWT cryptographic signing | *(Must change in production)* |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes | `1440` (24 hours) |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:5173,...` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for API requests | `/api` (proxied by Vite in dev) |

---

## 8. Deployment Guide

### Deploying Frontend (Vercel)
1. Push repository to GitHub/GitLab.
2. Link project on [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.onrender.com/api`
5. Deploy. `frontend/vercel.json` ensures all SPA routes route smoothly.

### Deploying Backend (Render / Railway)
1. Create a **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
2. Choose Python runtime or Dockerfile:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
3. Configure Environment Variables (`ENVIRONMENT=production`, `SECRET_KEY`, `CORS_ORIGINS`).
4. Attach a PostgreSQL database (e.g. Render PostgreSQL Free Tier or Neon.tech Free Tier) and set `DATABASE_URL`.

---

## 9. Implemented vs. Future Scope

### Implemented Features
- [x] Complete REST API with 14+ endpoints and Swagger documentation.
- [x] Relational schema supporting Users, Cities, Dishes, Places, and Favorites.
- [x] Rich starter dataset covering Hyderabad, Chennai, Amritsar, Kolkata, Mumbai, Delhi, Lucknow, Jaipur, Ahmedabad, Kochi, Srinagar, and Goa.
- [x] Interactive OpenStreetMap discovery powered by Leaflet with custom SVG brand markers.
- [x] "Explore Food Near Me" geolocation handling with non-intrusive permission flow.
- [x] Multi-facet filtering by city, cuisine style, dietary classification (Vegetarian/Non-Vegetarian), and keywords.
- [x] Dual-persistence favorites (guest `localStorage` + authenticated cloud sync).
- [x] Stateless JWT authentication with secure PBKDF2 password hashing.
- [x] Custom brand identity, responsive layouts, 404 handler, and fallback image states.
- [x] Automated backend (Pytest & live test suite) and frontend (Vitest & React Testing Library) test suites.

### Future Scope (Post-MVP Enhancements)
- [ ] User dish reviews and community photo uploads.
- [ ] Multilingual support (Hindi, Tamil, Telugu, Bengali, Punjabi).
- [ ] Direct offline caching via PWA service worker.
- [ ] Seasonal food calendar (e.g., winter *Sarson da Saag*, Ramadan *Haleem*).

---

## 10. External Dependencies & Potential Costs
- **OpenStreetMap Tiles**: Free for moderate educational/commercial use under ODbL guidelines.
- **Unsplash Images**: Free public URLs with fallback placeholder handling.
- **Hosting Free Tiers**:
  - Vercel (Hobby Free Tier)
  - Render (Free Web Service & Free PostgreSQL instance) or Neon (Free Serverless PostgreSQL)
  *Note: Free-tier limits typically sleep inactive web services after 15 minutes of inactivity.*

