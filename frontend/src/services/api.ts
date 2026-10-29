import { City, CityDetail, Dish, DishDetail, Place, SearchResult, Favorite, AuthResponse, User } from '../types';

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
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // Cities
  async getCities(params?: { region?: string; search?: string; limit?: number }): Promise<City[]> {
    const url = new URL(`${API_BASE}/cities`, window.location.origin);
    if (params?.region) url.searchParams.set('region', params.region);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.limit) url.searchParams.set('limit', params.limit.toString());
    const res = await fetch(url.toString());
    return handleResponse<City[]>(res);
  },

  async getCity(id: number): Promise<CityDetail> {
    const res = await fetch(`${API_BASE}/cities/${id}`);
    return handleResponse<CityDetail>(res);
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
    const url = new URL(`${API_BASE}/dishes`, window.location.origin);
    if (params?.city_id) url.searchParams.set('city_id', params.city_id.toString());
    if (params?.cuisine) url.searchParams.set('cuisine', params.cuisine);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.dietary) url.searchParams.set('dietary', params.dietary);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.sort) url.searchParams.set('sort', params.sort);
    if (params?.limit) url.searchParams.set('limit', params.limit.toString());
    const res = await fetch(url.toString());
    return handleResponse<Dish[]>(res);
  },

  async getDish(id: number): Promise<DishDetail> {
    const res = await fetch(`${API_BASE}/dishes/${id}`);
    return handleResponse<DishDetail>(res);
  },

  // Places
  async getPlaces(params?: { city_id?: number; dish_id?: number }): Promise<Place[]> {
    const url = new URL(`${API_BASE}/places`, window.location.origin);
    if (params?.city_id) url.searchParams.set('city_id', params.city_id.toString());
    if (params?.dish_id) url.searchParams.set('dish_id', params.dish_id.toString());
    const res = await fetch(url.toString());
    return handleResponse<Place[]>(res);
  },

  // Unified Search
  async search(query: string): Promise<SearchResult> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    return handleResponse<SearchResult>(res);
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

