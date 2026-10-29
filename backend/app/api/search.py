from typing import List, Set
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.database import get_db
from backend.app.models.models import City, Dish
from backend.app.schemas.schemas import SearchResultResponse, DishResponse, CityResponse

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResultResponse)
def search_all(
    q: str = Query(..., min_length=1, description="Search term for city, dish, cuisine, or ingredient"),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Unified search across Indian regional dishes, destinations, and cuisine styles."""
    query_str = f"%{q.strip()}%"

    # Search Cities
    cities = (
        db.query(City)
        .filter(
            (City.name.ilike(query_str)) |
            (City.state.ilike(query_str)) |
            (City.region.ilike(query_str)) |
            (City.description.ilike(query_str))
        )
        .limit(limit)
        .all()
    )

    city_responses = []
    for c in cities:
        d_count = db.query(func.count(Dish.id)).filter(Dish.city_id == c.id).scalar() or 0
        city_responses.append(CityResponse(
            id=c.id,
            name=c.name,
            state=c.state,
            region=c.region,
            latitude=c.latitude,
            longitude=c.longitude,
            description=c.description,
            banner_image=c.banner_image,
            is_sample=c.is_sample,
            created_at=c.created_at,
            dish_count=d_count
        ))

    # Search Dishes
    dish_records = (
        db.query(Dish, City.name.label("city_name"))
        .join(City, Dish.city_id == City.id)
        .filter(
            (Dish.name.ilike(query_str)) |
            (Dish.cuisine_type.ilike(query_str)) |
            (Dish.category.ilike(query_str)) |
            (Dish.key_ingredients.ilike(query_str)) |
            (Dish.description.ilike(query_str)) |
            (City.name.ilike(query_str))
        )
        .limit(limit)
        .all()
    )

    dish_responses = []
    cuisines: Set[str] = set()
    for dish, city_name in dish_records:
        dish_responses.append(DishResponse(
            id=dish.id,
            name=dish.name,
            city_id=dish.city_id,
            city_name=city_name,
            state=dish.state,
            cuisine_type=dish.cuisine_type,
            category=dish.category,
            dietary=dish.dietary,
            spice_level=dish.spice_level,
            description=dish.description,
            cultural_context=dish.cultural_context,
            key_ingredients=dish.key_ingredients,
            image_url=dish.image_url,
            is_sample=dish.is_sample,
            created_at=dish.created_at
        ))
        if q.lower() in dish.cuisine_type.lower():
            cuisines.add(dish.cuisine_type)

    return SearchResultResponse(
        query=q,
        dishes=dish_responses,
        cities=city_responses,
        cuisines=list(cuisines)
    )

