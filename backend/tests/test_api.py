import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.main import app
from backend.app.database import Base, get_db
from backend.app.models import User, City, Dish, Place, Favorite
from backend.app.services.seed import seed_database

# Use a test SQLite database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_map_my_food.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_database(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_health_check():
    """Verify health endpoint returns healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Map My Food API"

def test_list_cities():
    """Verify listing cities with initial seed data."""
    response = client.get("/api/cities")
    assert response.status_code == 200
    cities = response.json()
    assert len(cities) >= 4
    city_names = [c["name"] for c in cities]
    assert "Hyderabad" in city_names
    assert "Chennai" in city_names
    assert "Amritsar" in city_names
    assert "Kolkata" in city_names

def test_city_details():
    """Verify retrieving detailed city information."""
    response = client.get("/api/cities/1")
    assert response.status_code == 200
    city = response.json()
    assert "name" in city
    assert "signature_dishes" in city
    assert "places" in city

def test_list_dishes():
    """Verify listing dishes with starter requirements."""
    response = client.get("/api/dishes")
    assert response.status_code == 200
    dishes = response.json()
    assert len(dishes) >= 4
    dish_names = [d["name"] for d in dishes]
    assert any("Biryani" in name for name in dish_names)
    assert any("Dosa" in name for name in dish_names)
    assert any("Kulcha" in name for name in dish_names)
    assert any("Kathi Roll" in name for name in dish_names)

def test_filter_dishes():
    """Test filtering dishes by dietary and cuisine."""
    veg_res = client.get("/api/dishes?dietary=Vegetarian")
    assert veg_res.status_code == 200
    for d in veg_res.json():
        assert d["dietary"] == "Vegetarian"

def test_dish_details():
    """Verify dish detail endpoint."""
    response = client.get("/api/dishes/1")
    assert response.status_code == 200
    dish = response.json()
    assert "name" in dish
    assert "city_name" in dish
    assert "cultural_context" in dish
    assert "places_to_try" in dish
    assert "related_dishes" in dish

def test_unified_search():
    """Verify search across multiple entities."""
    response = client.get("/api/search?q=Biryani")
    assert response.status_code == 200
    data = response.json()
    assert len(data["dishes"]) > 0

def test_guest_browsing():
    """Ensure guests can freely browse dishes, cities, and search without credentials."""
    assert client.get("/api/cities").status_code == 200
    assert client.get("/api/dishes").status_code == 200
    assert client.get("/api/places").status_code == 200
    assert client.get("/api/search?q=Chennai").status_code == 200

def test_auth_workflow_and_favorites():
    """Test user registration, login, and managing favorites."""
    # 1. Register new user
    user_payload = {
        "email": "testfoodie@example.com",
        "password": "securepassword123",
        "full_name": "Test Foodie"
    }
    reg_res = client.post("/api/auth/register", json=user_payload)
    assert reg_res.status_code == 201
    auth_data = reg_res.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Check /api/auth/me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "testfoodie@example.com"

    # 3. Add favorite dish
    fav_res = client.post("/api/favorites", json={"dish_id": 1}, headers=headers)
    assert fav_res.status_code == 201
    fav_data = fav_res.json()
    fav_id = fav_data["id"]

    # 4. List favorites
    list_fav = client.get("/api/favorites", headers=headers)
    assert list_fav.status_code == 200
    assert len(list_fav.json()) == 1
    assert list_fav.json()[0]["dish_id"] == 1

    # 5. Remove favorite
    del_res = client.delete(f"/api/favorites/{fav_id}", headers=headers)
    assert del_res.status_code == 200

    # 6. Verify removed
    list_fav_after = client.get("/api/favorites", headers=headers)
    assert len(list_fav_after.json()) == 0

def test_invalid_request_handling():
    """Test validation errors and missing endpoints."""
    # Invalid email on register
    bad_reg = client.post("/api/auth/register", json={"email": "not-an-email", "password": "123"})
    assert bad_reg.status_code == 422

    # Protected endpoint without auth token
    unauthorized_res = client.get("/api/favorites")
    assert unauthorized_res.status_code == 401

    # 404 for nonexistent dish
    not_found_res = client.get("/api/dishes/99999")
    assert not_found_res.status_code == 404
