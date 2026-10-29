import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), index=True, nullable=False)
    state = Column(String(120), index=True, nullable=False)
    region = Column(String(60), index=True, nullable=False)  # North, South, East, West, Central, North-East
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    banner_image = Column(String(500), nullable=True)
    is_sample = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    dishes = relationship("Dish", back_populates="city", cascade="all, delete-orphan")
    places = relationship("Place", back_populates="city", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="city", cascade="all, delete-orphan")


class Dish(Base):
    __tablename__ = "dishes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(160), index=True, nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False, index=True)
    state = Column(String(120), index=True, nullable=False)
    cuisine_type = Column(String(80), index=True, nullable=False) # e.g. Awadhi, Mughlai, Punjabi, South Indian, Bengali, etc.
    category = Column(String(80), index=True, nullable=False) # Breakfast, Main Course, Street Food, Snack, Dessert, Beverage
    dietary = Column(String(40), index=True, nullable=False) # Vegetarian, Non-Vegetarian, Vegan
    spice_level = Column(String(40), default="Medium", nullable=False) # Mild, Medium, Spicy, Extra Spicy
    description = Column(Text, nullable=False)
    cultural_context = Column(Text, nullable=True)
    key_ingredients = Column(Text, nullable=True) # Comma-separated or JSON list of ingredients
    image_url = Column(String(500), nullable=True)
    is_sample = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    city = relationship("City", back_populates="dishes")
    places = relationship("Place", back_populates="dish", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="dish", cascade="all, delete-orphan")


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True, nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False, index=True)
    dish_id = Column(Integer, ForeignKey("dishes.id"), nullable=True, index=True)
    address = Column(String(300), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    price_range = Column(String(40), default="Moderate", nullable=False) # Budget, Moderate, Premium
    is_sample = Column(Boolean, default=True, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    city = relationship("City", back_populates="places")
    dish = relationship("Dish", back_populates="places")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    dish_id = Column(Integer, ForeignKey("dishes.id"), nullable=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="favorites")
    dish = relationship("Dish", back_populates="favorites")
    city = relationship("City", back_populates="favorites")

    __table_args__ = (
        UniqueConstraint("user_id", "dish_id", name="uq_user_dish_favorite"),
        UniqueConstraint("user_id", "city_id", name="uq_user_city_favorite"),
    )

