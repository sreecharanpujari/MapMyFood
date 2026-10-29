export interface City {
  id: number;
  name: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  banner_image?: string;
  is_sample: boolean;
  created_at: string;
  dish_count: number;
}

export interface Dish {
  id: number;
  name: string;
  city_id: number;
  city_name?: string;
  state: string;
  cuisine_type: string;
  category: string;
  dietary: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';
  spice_level: 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy';
  description: string;
  cultural_context?: string;
  key_ingredients?: string;
  image_url?: string;
  is_sample: boolean;
  created_at: string;
}

export interface Place {
  id: number;
  name: string;
  city_id: number;
  dish_id?: number;
  address?: string;
  latitude: number;
  longitude: number;
  price_range: 'Budget' | 'Moderate' | 'Premium';
  is_sample: boolean;
  notes?: string;
  created_at: string;
}

export interface CityDetail extends City {
  signature_dishes: Dish[];
  places: Place[];
  related_cities: City[];
}

export interface DishDetail extends Dish {
  city_region: string;
  city_state: string;
  places_to_try: Place[];
  related_dishes: Dish[];
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Favorite {
  id: number;
  user_id: number;
  dish_id?: number;
  city_id?: number;
  created_at: string;
  dish?: Dish;
  city?: City;
}

export interface SearchResult {
  query: string;
  dishes: Dish[];
  cities: City[];
  cuisines: string[];
}

