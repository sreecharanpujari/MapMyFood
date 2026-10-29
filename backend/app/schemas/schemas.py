from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

# --- Auth & User Schemas ---

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None


# --- Place Schemas ---

class PlaceBase(BaseModel):
    name: str
    city_id: int
    dish_id: Optional[int] = None
    address: Optional[str] = None
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    price_range: str = "Moderate"
    is_sample: bool = True
    notes: Optional[str] = None

class PlaceResponse(PlaceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Dish Schemas ---

class DishBase(BaseModel):
    name: str
    city_id: int
    state: str
    cuisine_type: str
    category: str
    dietary: str
    spice_level: str = "Medium"
    description: str
    cultural_context: Optional[str] = None
    key_ingredients: Optional[str] = None
    image_url: Optional[str] = None
    is_sample: bool = False

class DishResponse(DishBase):
    id: int
    created_at: datetime
    city_name: Optional[str] = None

    class Config:
        from_attributes = True

class DishDetailResponse(DishResponse):
    city_name: str
    city_region: str
    city_state: str
    places_to_try: List[PlaceResponse] = []
    related_dishes: List[DishResponse] = []


# --- City Schemas ---

class CityBase(BaseModel):
    name: str
    state: str
    region: str
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    description: str
    banner_image: Optional[str] = None
    is_sample: bool = False

class CityResponse(CityBase):
    id: int
    dish_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

class CityDetailResponse(CityBase):
    id: int
    created_at: datetime
    signature_dishes: List[DishResponse] = []
    places: List[PlaceResponse] = []
    related_cities: List[CityResponse] = []

    class Config:
        from_attributes = True


# --- Favorite Schemas ---

class FavoriteCreate(BaseModel):
    dish_id: Optional[int] = None
    city_id: Optional[int] = None

    @field_validator("city_id")
    @classmethod
    def validate_one_present(cls, v, values):
        return v

class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    dish_id: Optional[int] = None
    city_id: Optional[int] = None
    created_at: datetime
    dish: Optional[DishResponse] = None
    city: Optional[CityResponse] = None

    class Config:
        from_attributes = True


# --- Search Schemas ---

class SearchResultResponse(BaseModel):
    query: str
    dishes: List[DishResponse] = []
    cities: List[CityResponse] = []
    cuisines: List[str] = []

