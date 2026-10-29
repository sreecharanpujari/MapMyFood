from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import Place
from backend.app.schemas.schemas import PlaceResponse

router = APIRouter(prefix="/places", tags=["Places"])

@router.get("", response_model=List[PlaceResponse])
def get_places(
    city_id: Optional[int] = Query(None, description="Filter places by city ID"),
    dish_id: Optional[int] = Query(None, description="Filter places by dish ID"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Retrieve sample places and eateries. All sample records are clearly marked."""
    query = db.query(Place)
    if city_id:
        query = query.filter(Place.city_id == city_id)
    if dish_id:
        query = query.filter(Place.dish_id == dish_id)

    places = query.offset(offset).limit(limit).all()
    return places

@router.get("/{place_id}", response_model=PlaceResponse)
def get_place(place_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a single place."""
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Place not found")
    return place

