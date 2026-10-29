import { City, CityDetail, Dish, DishDetail, Place, SearchResult, Favorite, AuthResponse, User } from '../types';
import { FALLBACK_CITIES, FALLBACK_DISHES, FALLBACK_PLACES } from './fallbackData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('mmf_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorJson.message || res.statusText;
    } catch {
      errorDetail = res.statusText;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  // Health
  async getHealth(): Promise<{ status: string; service: string }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await handleResponse(res);
    } catch {
      return { status: "healthy (offline mode)", service: "Map My Food" };
    }
  },

  // Cities
  async getCities(params?: { region?: string; search?: string; limit?: number }): Promise<City[]> {
    try {
      const url = new URL(`${API_BASE}/cities`, window.location.origin);
      if (params?.region) url.searchParams.set('region', params.region);
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.limit) url.searchParams.set('limit', params.limit.toString());
      const res = await fetch(url.toString());
      return await handleResponse<City[]>(res);
    } catch (err) {
      console.warn("Backend unavailable, using rich built-in regional dataset:", err);
      let list = [...FALLBACK_CITIES];
      if (params?.region) {
        list = list.filter(c => c.region.toLowerCase().includes(params.region!.toLowerCase()));
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q));
      }
      if (params?.limit) {
        list = list.slice(0, params.limit);
      }
      return list;
    }
  },

  async getCity(id: number): Promise<CityDetail> {
    try {
      const res = await fetch(`${API_BASE}/cities/${id}`);
      return await handleResponse<CityDetail>(res);
    } catch (err) {
      console.warn(`Backend unavailable for city ${id}, serving built-in data.`);
      const city = FALLBACK_CITIES.find(c => c.id === id) || FALLBACK_CITIES[0];
      const dishes = FALLBACK_DISHES.filter(d => d.city_id === city.id);
      const places = FALLBACK_PLACES.filter(p => p.city_id === city.id);
      const related = FALLBACK_CITIES.filter(c => c.id !== city.id && c.region === city.region).slice(0, 3);
      return {
        ...city,
        signature_dishes: dishes,
        places: places,
        related_cities: related.length > 0 ? related : FALLBACK_CITIES.filter(c => c.id !== city.id).slice(0, 3)
      };
    }
  },

  // Dishes
  async getDishes(params?: {
    city_id?: number;
    cuisine?: string;
    category?: string;
    dietary?: string;
    search?: string;
    sort?: string;
    limit?: number;
  }): Promise<Dish[]> {
    try {
      const url = new URL(`${API_BASE}/dishes`, window.location.origin);
      if (params?.city_id) url.searchParams.set('city_id', params.city_id.toString());
      if (params?.cuisine) url.searchParams.set('cuisine', params.cuisine);
      if (params?.category) url.searchParams.set('category', params.category);
      if (params?.dietary) url.searchParams.set('dietary', params.dietary);
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.sort) url.searchParams.set('sort', params.sort);
      if (params?.limit) url.searchParams.set('limit', params.limit.toString());
      const res = await fetch(url.toString());
      return await handleResponse<Dish[]>(res);
    } catch (err) {
      console.warn("Backend unavailable, using built-in dish collection:", err);
      let list = [...FALLBACK_DISHES];
      if (params?.city_id) {
        list = list.filter(d => d.city_id === params.city_id);
      }
      if (params?.cuisine) {
        list = list.filter(d => d.cuisine_type.toLowerCase().includes(params.cuisine!.toLowerCase()));
      }
      if (params?.category) {
        list = list.filter(d => d.category.toLowerCase().includes(params.category!.toLowerCase()));
      }
      if (params?.dietary) {
        list = list.filter(d => d.dietary.toLowerCase() === params.dietary!.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(d =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.cuisine_type.toLowerCase().includes(q) ||
          (d.city_name && d.city_name.toLowerCase().includes(q))
        );
      }
      if (params?.sort === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (params?.sort === 'name_desc') {
        list.sort((a, b) => b.name.localeCompare(a.name));
      }
      if (params?.limit) {
        list = list.slice(0, params.limit);
      }
      return list;
    }
  },

  async getDish(id: number): Promise<DishDetail> {
    try {
      const res = await fetch(`${API_BASE}/dishes/${id}`);
      return await handleResponse<DishDetail>(res);
    } catch (err) {
      console.warn(`Backend unavailable for dish ${id}, using fallback.`);
      const dish = FALLBACK_DISHES.find(d => d.id === id) || FALLBACK_DISHES[0];
      const city = FALLBACK_CITIES.find(c => c.id === dish.city_id);
      const places = FALLBACK_PLACES.filter(p => p.dish_id === dish.id || p.city_id === dish.city_id);
      const related = FALLBACK_DISHES.filter(d => d.id !== dish.id && (d.city_id === dish.city_id || d.cuisine_type === dish.cuisine_type)).slice(0, 4);
      return {
        ...dish,
        city_name: city ? city.name : "India",
        city_region: city ? city.region : "Regional",
        city_state: city ? city.state : dish.state,
        places_to_try: places,
        related_dishes: related
      };
    }
  },

  // Places
  async getPlaces(params?: { city_id?: number; dish_id?: number }): Promise<Place[]> {
    try {
      const url = new URL(`${API_BASE}/places`, window.location.origin);
      if (params?.city_id) url.searchParams.set('city_id', params.city_id.toString());
      if (params?.dish_id) url.searchParams.set('dish_id', params.dish_id.toString());
      const res = await fetch(url.toString());
      return await handleResponse<Place[]>(res);
    } catch {
      let list = [...FALLBACK_PLACES];
      if (params?.city_id) list = list.filter(p => p.city_id === params.city_id);
      if (params?.dish_id) list = list.filter(p => p.dish_id === params.dish_id);
      return list;
    }
  },

  // Unified Search
  async search(query: string): Promise<SearchResult> {
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      return await handleResponse<SearchResult>(res);
    } catch {
      const q = query.toLowerCase();
      const matchedDishes = FALLBACK_DISHES.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.cuisine_type.toLowerCase().includes(q) ||
        (d.city_name && d.city_name.toLowerCase().includes(q))
      );
      const matchedCities = FALLBACK_CITIES.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );
      return {
        query,
        dishes: matchedDishes,
        cities: matchedCities,
        cuisines: []
      };
    }
  },

  // Authentication
  async register(data: { email: string; password: string; full_name?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<AuthResponse>(res);
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<AuthResponse>(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<User>(res);
  },

  // Favorites
  async getFavorites(): Promise<Favorite[]> {
    const res = await fetch(`${API_BASE}/favorites`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<Favorite[]>(res);
  },

  async addFavorite(data: { dish_id?: number; city_id?: number }): Promise<Favorite> {
    const res = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse<Favorite>(res);
  },

  async removeFavorite(favoriteId: number): Promise<{ message: string; id: number }> {
    const res = await fetch(`${API_BASE}/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async removeFavoriteByEntity(params: { dish_id?: number; city_id?: number }): Promise<{ message: string; id: number }> {
    const url = new URL(`${API_BASE}/favorites`, window.location.origin);
    if (params.dish_id) url.searchParams.set('dish_id', params.dish_id.toString());
    if (params.city_id) url.searchParams.set('city_id', params.city_id.toString());
    const res = await fetch(url.toString(), {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};
