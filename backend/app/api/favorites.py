from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import Favorite, Dish, City, User
from backend.app.schemas.schemas import FavoriteCreate, FavoriteResponse, DishResponse, CityResponse
from backend.app.services.auth import get_current_user

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.get("", response_model=List[FavoriteResponse])
def get_user_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all saved favorite dishes and destinations for authenticated user."""
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id).order_by(Favorite.created_at.desc()).all()
    
    responses = []
    for f in favs:
        dish_resp = None
        if f.dish:
            city_name = f.dish.city.name if f.dish.city else ""
            dish_resp = DishResponse(
                id=f.dish.id,
                name=f.dish.name,
                city_id=f.dish.city_id,
                city_name=city_name,
                state=f.dish.state,
                cuisine_type=f.dish.cuisine_type,
                category=f.dish.category,
                dietary=f.dish.dietary,
                spice_level=f.dish.spice_level,
                description=f.dish.description,
                cultural_context=f.dish.cultural_context,
                key_ingredients=f.dish.key_ingredients,
                image_url=f.dish.image_url,
                is_sample=f.dish.is_sample,
                created_at=f.dish.created_at
            )

        city_resp = None
        if f.city:
            d_count = len(f.city.dishes) if f.city.dishes else 0
            city_resp = CityResponse(
                id=f.city.id,
                name=f.city.name,
                state=f.city.state,
                region=f.city.region,
                latitude=f.city.latitude,
                longitude=f.city.longitude,
                description=f.city.description,
                banner_image=f.city.banner_image,
                is_sample=f.city.is_sample,
                created_at=f.city.created_at,
                dish_count=d_count
            )

        responses.append(FavoriteResponse(
            id=f.id,
            user_id=f.user_id,
            dish_id=f.dish_id,
            city_id=f.city_id,
            created_at=f.created_at,
            dish=dish_resp,
            city=city_resp
        ))

    return responses

@router.post("", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(
    fav_in: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a dish or city destination to favorites."""
    if not fav_in.dish_id and not fav_in.city_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must provide either dish_id or city_id to favorite."
        )

    # Check existence
    if fav_in.dish_id:
        dish = db.query(Dish).filter(Dish.id == fav_in.dish_id).first()
        if not dish:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
        # Check duplicate
        existing = db.query(Favorite).filter(
            Favorite.user_id == current_user.id,
            Favorite.dish_id == fav_in.dish_id
        ).first()
        if existing:
            return get_single_fav_response(existing)

        new_fav = Favorite(user_id=current_user.id, dish_id=fav_in.dish_id)
        db.add(new_fav)
        db.commit()
        db.refresh(new_fav)
        return get_single_fav_response(new_fav)

    if fav_in.city_id:
        city = db.query(City).filter(City.id == fav_in.city_id).first()
        if not city:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
        existing = db.query(Favorite).filter(
            Favorite.user_id == current_user.id,
            Favorite.city_id == fav_in.city_id
        ).first()
        if existing:
            return get_single_fav_response(existing)

        new_fav = Favorite(user_id=current_user.id, city_id=fav_in.city_id)
        db.add(new_fav)
        db.commit()
        db.refresh(new_fav)
        return get_single_fav_response(new_fav)

@router.delete("/{favorite_id}", status_code=status.HTTP_200_OK)
def remove_favorite_by_id(
    favorite_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a favorite entry by favorite record ID."""
    fav = db.query(Favorite).filter(
        Favorite.id == favorite_id,
        Favorite.user_id == current_user.id
    ).first()
    if not fav:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")

    db.delete(fav)
    db.commit()
    return {"message": "Favorite successfully removed", "id": favorite_id}

@router.delete("", status_code=status.HTTP_200_OK)
def remove_favorite_by_entity(
    dish_id: int = None,
    city_id: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove favorite by dish_id or city_id directly."""
    query = db.query(Favorite).filter(Favorite.user_id == current_user.id)
    if dish_id:
        query = query.filter(Favorite.dish_id == dish_id)
    elif city_id:
        query = query.filter(Favorite.city_id == city_id)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Must supply dish_id or city_id")

    fav = query.first()
    if not fav:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")

    fav_id = fav.id
    db.delete(fav)
    db.commit()
    return {"message": "Favorite successfully removed", "id": fav_id}

def get_single_fav_response(f: Favorite) -> FavoriteResponse:
    dish_resp = None
    if f.dish:
        dish_resp = DishResponse(
            id=f.dish.id,
            name=f.dish.name,
            city_id=f.dish.city_id,
            city_name=f.dish.city.name if f.dish.city else "",
            state=f.dish.state,
            cuisine_type=f.dish.cuisine_type,
            category=f.dish.category,
            dietary=f.dish.dietary,
            spice_level=f.dish.spice_level,
            description=f.dish.description,
            cultural_context=f.dish.cultural_context,
            key_ingredients=f.dish.key_ingredients,
            image_url=f.dish.image_url,
            is_sample=f.dish.is_sample,
            created_at=f.dish.created_at
        )
    city_resp = None
    if f.city:
        city_resp = CityResponse(
            id=f.city.id,
            name=f.city.name,
            state=f.city.state,
            region=f.city.region,
            latitude=f.city.latitude,
            longitude=f.city.longitude,
            description=f.city.description,
            banner_image=f.city.banner_image,
            is_sample=f.city.is_sample,
            created_at=f.city.created_at,
            dish_count=len(f.city.dishes) if f.city.dishes else 0
        )
    return FavoriteResponse(
        id=f.id,
        user_id=f.user_id,
        dish_id=f.dish_id,
        city_id=f.city_id,
        created_at=f.created_at,
        dish=dish_resp,
        city=city_resp
    )

