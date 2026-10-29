from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
# Explicitly import models so SQLAlchemy metadata is aware of all tables
from backend.app.models import User, City, Dish, Place, Favorite
from backend.app.services.seed import seed_database
from backend.app.api.auth import router as auth_router
from backend.app.api.cities import router as cities_router
from backend.app.api.dishes import router as dishes_router
from backend.app.api.places import router as places_router
from backend.app.api.favorites import router as favorites_router
from backend.app.api.search import router as search_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    # Seed initial authentic regional food data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Map My Food API",
    description="Discover India's regional culinary heritage, signature dishes, and culinary destinations.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(cities_router, prefix="/api")
app.include_router(dishes_router, prefix="/api")
app.include_router(places_router, prefix="/api")
app.include_router(favorites_router, prefix="/api")
app.include_router(search_router, prefix="/api")

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify API and database connectivity."""
    return {
        "status": "healthy",
        "service": "Map My Food API",
        "environment": settings.ENVIRONMENT,
        "database": "connected"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Map My Food API — Discover India's Regional Food",
        "documentation": "/docs",
        "health": "/api/health"
    }
