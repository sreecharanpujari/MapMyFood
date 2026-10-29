from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.database import get_db
from backend.app.models.models import City, Dish, Place
from backend.app.schemas.schemas import CityResponse, CityDetailResponse, DishResponse, PlaceResponse

router = APIRouter(prefix="/cities", tags=["Cities"])

@router.get("", response_model=List[CityResponse])
def get_cities(
    region: Optional[str] = Query(None, description="Filter by region (North, South, East, West, etc.)"),
    search: Optional[str] = Query(None, description="Search by city or state name"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Retrieve supported Indian food cities with optional region filtering and search."""
    query = db.query(City)

    if region:
        query = query.filter(City.region.ilike(f"%{region}%"))
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (City.name.ilike(search_term)) | (City.state.ilike(search_term))
        )

    cities = query.offset(offset).limit(limit).all()

    # Annotate with dish count
    results = []
    for city in cities:
        dish_count = db.query(func.count(Dish.id)).filter(Dish.city_id == city.id).scalar() or 0
        city_dict = {
            "id": city.id,
            "name": city.name,
            "state": city.state,
            "region": city.region,
            "latitude": city.latitude,
            "longitude": city.longitude,
            "description": city.description,
            "banner_image": city.banner_image,
            "is_sample": city.is_sample,
            "created_at": city.created_at,
            "dish_count": dish_count
        }
        results.append(CityResponse(**city_dict))

    return results

@router.get("/{city_id}", response_model=CityDetailResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    """Retrieve detailed information about a city, including its signature dishes and places."""
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")

    dishes = db.query(Dish).filter(Dish.city_id == city.id).all()
    places = db.query(Place).filter(Place.city_id == city.id).all()
    
    # Related destinations from same or neighbouring regions
    related = (
        db.query(City)
        .filter(City.id != city.id)
        .filter((City.region == city.region) | (City.state == city.state))
        .limit(4)
        .all()
    )
    if not related:
        related = db.query(City).filter(City.id != city.id).limit(4).all()

    related_responses = []
    for r in related:
        d_count = db.query(func.count(Dish.id)).filter(Dish.city_id == r.id).scalar() or 0
        related_responses.append(CityResponse(
            id=r.id,
            name=r.name,
            state=r.state,
            region=r.region,
            latitude=r.latitude,
            longitude=r.longitude,
            description=r.description,
            banner_image=r.banner_image,
            is_sample=r.is_sample,
            created_at=r.created_at,
            dish_count=d_count
        ))

    return CityDetailResponse(
        id=city.id,
        name=city.name,
        state=city.state,
        region=city.region,
        latitude=city.latitude,
        longitude=city.longitude,
        description=city.description,
        banner_image=city.banner_image,
        is_sample=city.is_sample,
        created_at=city.created_at,
        signature_dishes=[
            DishResponse(
                id=d.id,
                name=d.name,
                city_id=d.city_id,
                city_name=city.name,
                state=d.state,
                cuisine_type=d.cuisine_type,
                category=d.category,
                dietary=d.dietary,
                spice_level=d.spice_level,
                description=d.description,
                cultural_context=d.cultural_context,
                key_ingredients=d.key_ingredients,
                image_url=d.image_url,
                is_sample=d.is_sample,
                created_at=d.created_at
            )
            for d in dishes
        ],
        places=[PlaceResponse.model_validate(p) for p in places],
        related_cities=related_responses
    )

