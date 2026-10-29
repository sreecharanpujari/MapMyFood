from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.database import get_db
from backend.app.models.models import City, Dish, Place
from backend.app.schemas.schemas import DishResponse, DishDetailResponse, PlaceResponse

router = APIRouter(prefix="/dishes", tags=["Dishes"])

@router.get("", response_model=List[DishResponse])
def get_dishes(
    city_id: Optional[int] = Query(None, description="Filter by city ID"),
    cuisine: Optional[str] = Query(None, description="Filter by cuisine type"),
    category: Optional[str] = Query(None, description="Filter by category (Breakfast, Street Food, etc.)"),
    dietary: Optional[str] = Query(None, description="Filter by dietary preference (Vegetarian, Non-Vegetarian)"),
    search: Optional[str] = Query(None, description="Search dish name, description, or ingredients"),
    sort: Optional[str] = Query("newest", description="Sort by: newest, name_asc, name_desc"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Retrieve Indian regional dishes with flexible search and filtering."""
    query = db.query(Dish, City.name.label("city_name")).join(City, Dish.city_id == City.id)

    if city_id:
        query = query.filter(Dish.city_id == city_id)
    if cuisine:
        query = query.filter(Dish.cuisine_type.ilike(f"%{cuisine}%"))
    if category:
        query = query.filter(Dish.category.ilike(f"%{category}%"))
    if dietary:
        query = query.filter(func.lower(Dish.dietary) == dietary.lower())
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Dish.name.ilike(search_term)) |
            (Dish.description.ilike(search_term)) |
            (Dish.key_ingredients.ilike(search_term)) |
            (Dish.cuisine_type.ilike(search_term)) |
            (City.name.ilike(search_term))
        )

    if sort == "name_asc":
        query = query.order_by(Dish.name.asc())
    elif sort == "name_desc":
        query = query.order_by(Dish.name.desc())
    else:
        query = query.order_by(Dish.id.desc())

    records = query.offset(offset).limit(limit).all()

    results = []
    for dish, city_name in records:
        d_dict = {
            "id": dish.id,
            "name": dish.name,
            "city_id": dish.city_id,
            "city_name": city_name,
            "state": dish.state,
            "cuisine_type": dish.cuisine_type,
            "category": dish.category,
            "dietary": dish.dietary,
            "spice_level": dish.spice_level,
            "description": dish.description,
            "cultural_context": dish.cultural_context,
            "key_ingredients": dish.key_ingredients,
            "image_url": dish.image_url,
            "is_sample": dish.is_sample,
            "created_at": dish.created_at
        }
        results.append(DishResponse(**d_dict))

    return results

@router.get("/{dish_id}", response_model=DishDetailResponse)
def get_dish(dish_id: int, db: Session = Depends(get_db)):
    """Retrieve full details of a dish including cultural context, places to try, and related dishes."""
    dish = db.query(Dish).filter(Dish.id == dish_id).first()
    if not dish:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")

    city = db.query(City).filter(City.id == dish.city_id).first()
    places = db.query(Place).filter(
        (Place.dish_id == dish.id) | (Place.city_id == dish.city_id)
    ).limit(5).all()

    # Related dishes from the same city or cuisine
    related = (
        db.query(Dish, City.name.label("city_name"))
        .join(City, Dish.city_id == City.id)
        .filter(Dish.id != dish.id)
        .filter((Dish.city_id == dish.city_id) | (Dish.cuisine_type == dish.cuisine_type))
        .limit(4)
        .all()
    )

    related_dishes = []
    for rel_dish, c_name in related:
        related_dishes.append(DishResponse(
            id=rel_dish.id,
            name=rel_dish.name,
            city_id=rel_dish.city_id,
            city_name=c_name,
            state=rel_dish.state,
            cuisine_type=rel_dish.cuisine_type,
            category=rel_dish.category,
            dietary=rel_dish.dietary,
            spice_level=rel_dish.spice_level,
            description=rel_dish.description,
            cultural_context=rel_dish.cultural_context,
            key_ingredients=rel_dish.key_ingredients,
            image_url=rel_dish.image_url,
            is_sample=rel_dish.is_sample,
            created_at=rel_dish.created_at
        ))

    return DishDetailResponse(
        id=dish.id,
        name=dish.name,
        city_id=dish.city_id,
        city_name=city.name if city else "",
        city_region=city.region if city else "",
        city_state=city.state if city else "",
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
        created_at=dish.created_at,
        places_to_try=[PlaceResponse.model_validate(p) for p in places],
        related_dishes=related_dishes
    )
