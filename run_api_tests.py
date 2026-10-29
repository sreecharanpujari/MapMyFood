import time
import subprocess
import urllib.request
import json
import sys

def run_tests():
    print("Starting uvicorn server for API testing...")
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8888"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    base_url = "http://127.0.0.1:8888"
    time.sleep(3)

    try:
        # 1. Health check
        print("\n[1] Testing GET /api/health...")
        req = urllib.request.Request(f"{base_url}/api/health")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            data = json.loads(resp.read().decode())
            assert data["status"] == "healthy"
            print("  [PASS] Health check passed:", data)

        # 2. Cities list
        print("\n[2] Testing GET /api/cities...")
        req = urllib.request.Request(f"{base_url}/api/cities")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            cities = json.loads(resp.read().decode())
            assert len(cities) >= 4
            city_names = [c["name"] for c in cities]
            assert "Hyderabad" in city_names
            assert "Chennai" in city_names
            assert "Amritsar" in city_names
            assert "Kolkata" in city_names
            print(f"  [PASS] Cities list passed ({len(cities)} cities loaded)")

        # 3. City detail
        print("\n[3] Testing GET /api/cities/1...")
        req = urllib.request.Request(f"{base_url}/api/cities/1")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            city = json.loads(resp.read().decode())
            assert "signature_dishes" in city
            assert "places" in city
            print(f"  [PASS] City detail passed for '{city['name']}' with {len(city['signature_dishes'])} signature dishes")

        # 4. Dishes list
        print("\n[4] Testing GET /api/dishes...")
        req = urllib.request.Request(f"{base_url}/api/dishes")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            dishes = json.loads(resp.read().decode())
            assert len(dishes) >= 4
            print(f"  [PASS] Dishes list passed ({len(dishes)} dishes loaded)")

        # 5. Dish filter by dietary
        print("\n[5] Testing GET /api/dishes?dietary=Vegetarian...")
        req = urllib.request.Request(f"{base_url}/api/dishes?dietary=Vegetarian")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            veg_dishes = json.loads(resp.read().decode())
            for d in veg_dishes:
                assert d["dietary"] == "Vegetarian"
            print(f"  [PASS] Vegetarian filter passed ({len(veg_dishes)} dishes)")

        # 6. Dish detail
        print("\n[6] Testing GET /api/dishes/1...")
        req = urllib.request.Request(f"{base_url}/api/dishes/1")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            dish = json.loads(resp.read().decode())
            assert "name" in dish
            assert "cultural_context" in dish
            assert "places_to_try" in dish
            assert "related_dishes" in dish
            print(f"  [PASS] Dish detail passed for '{dish['name']}' ({dish['cuisine_type']})")

        # 7. Unified Search
        print("\n[7] Testing GET /api/search?q=Biryani...")
        req = urllib.request.Request(f"{base_url}/api/search?q=Biryani")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            search_res = json.loads(resp.read().decode())
            assert len(search_res["dishes"]) > 0
            print(f"  [PASS] Search passed. Found {len(search_res['dishes'])} matching dishes")

        # 8. User Auth Flow (Register, Login, Me, Add Favorite, List Favorites, Remove Favorite)
        print("\n[8] Testing Auth & Favorites flow...")
        unique_email = f"foodie_{int(time.time())}@example.com"
        reg_payload = json.dumps({
            "email": unique_email,
            "password": "secretpassword123",
            "full_name": "Authentic Explorer"
        }).encode()
        reg_req = urllib.request.Request(
            f"{base_url}/api/auth/register",
            data=reg_payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(reg_req) as resp:
            assert resp.status == 201
            auth_data = json.loads(resp.read().decode())
            token = auth_data["access_token"]
            print(f"  [PASS] User registration passed for {unique_email}")

        auth_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }

        # Check /api/auth/me
        me_req = urllib.request.Request(f"{base_url}/api/auth/me", headers=auth_headers)
        with urllib.request.urlopen(me_req) as resp:
            assert resp.status == 200
            me_data = json.loads(resp.read().decode())
            assert me_data["email"] == unique_email
            print("  [PASS] /api/auth/me verified user profile")

        # Add favorite dish
        fav_payload = json.dumps({"dish_id": 1}).encode()
        fav_req = urllib.request.Request(
            f"{base_url}/api/favorites",
            data=fav_payload,
            headers=auth_headers
        )
        with urllib.request.urlopen(fav_req) as resp:
            assert resp.status == 201
            fav_data = json.loads(resp.read().decode())
            fav_id = fav_data["id"]
            print(f"  [PASS] Added dish #1 to favorites (Favorite ID: {fav_id})")

        # List favorites
        list_req = urllib.request.Request(f"{base_url}/api/favorites", headers=auth_headers)
        with urllib.request.urlopen(list_req) as resp:
            assert resp.status == 200
            favs = json.loads(resp.read().decode())
            assert len(favs) == 1
            assert favs[0]["dish_id"] == 1
            print("  [PASS] Retrieved user favorites list")

        # Remove favorite
        del_req = urllib.request.Request(
            f"{base_url}/api/favorites/{fav_id}",
            headers=auth_headers,
            method="DELETE"
        )
        with urllib.request.urlopen(del_req) as resp:
            assert resp.status == 200
            print("  [PASS] Deleted favorite successfully")

        # Verify favorites empty
        with urllib.request.urlopen(list_req) as resp:
            favs = json.loads(resp.read().decode())
            assert len(favs) == 0
            print("  [PASS] Verified favorites list is now empty")

        print("\n" + "="*50)
        print("ALL BACKEND ENDPOINTS AND TESTS PASSED SUCCESSFULLY!")
        print("="*50)

    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    run_tests()
