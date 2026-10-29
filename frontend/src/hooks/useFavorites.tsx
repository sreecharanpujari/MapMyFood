import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Dish, City, Favorite } from '../types';
import { api } from '../services/api';
import { useAuth } from './useAuth';

interface FavoritesContextType {
  favoriteDishes: Dish[];
  favoriteCities: City[];
  isDishFavorite: (dishId: number) => boolean;
  isCityFavorite: (cityId: number) => boolean;
  toggleDishFavorite: (dish: Dish) => Promise<void>;
  toggleCityFavorite: (city: City) => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const GUEST_DISHES_KEY = 'mmf_guest_fav_dishes';
const GUEST_CITIES_KEY = 'mmf_guest_fav_cities';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoriteDishes, setFavoriteDishes] = useState<Dish[]>([]);
  const [favoriteCities, setFavoriteCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load favorites whenever auth status changes
  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    if (user) {
      try {
        const backendFavs: Favorite[] = await api.getFavorites();
        const dishes = backendFavs.filter(f => f.dish).map(f => f.dish as Dish);
        const cities = backendFavs.filter(f => f.city).map(f => f.city as City);
        setFavoriteDishes(dishes);
        setFavoriteCities(cities);
      } catch (err) {
        console.error('Failed to load user favorites:', err);
      }
    } else {
      // Guest mode - load from localStorage
      try {
        const storedDishes = localStorage.getItem(GUEST_DISHES_KEY);
        const storedCities = localStorage.getItem(GUEST_CITIES_KEY);
        setFavoriteDishes(storedDishes ? JSON.parse(storedDishes) : []);
        setFavoriteCities(storedCities ? JSON.parse(storedCities) : []);
      } catch (err) {
        console.error('Failed to parse guest favorites from localStorage:', err);
        setFavoriteDishes([]);
        setFavoriteCities([]);
      }
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isDishFavorite = (dishId: number): boolean => {
    return favoriteDishes.some(d => d.id === dishId);
  };

  const isCityFavorite = (cityId: number): boolean => {
    return favoriteCities.some(c => c.id === cityId);
  };

  const toggleDishFavorite = async (dish: Dish) => {
    const isFav = isDishFavorite(dish.id);
    if (user) {
      if (isFav) {
        await api.removeFavoriteByEntity({ dish_id: dish.id });
        setFavoriteDishes(prev => prev.filter(d => d.id !== dish.id));
      } else {
        await api.addFavorite({ dish_id: dish.id });
        setFavoriteDishes(prev => [dish, ...prev]);
      }
    } else {
      // Guest mode
      let updated: Dish[];
      if (isFav) {
        updated = favoriteDishes.filter(d => d.id !== dish.id);
      } else {
        updated = [dish, ...favoriteDishes];
      }
      setFavoriteDishes(updated);
      localStorage.setItem(GUEST_DISHES_KEY, JSON.stringify(updated));
    }
  };

  const toggleCityFavorite = async (city: City) => {
    const isFav = isCityFavorite(city.id);
    if (user) {
      if (isFav) {
        await api.removeFavoriteByEntity({ city_id: city.id });
        setFavoriteCities(prev => prev.filter(c => c.id !== city.id));
      } else {
        await api.addFavorite({ city_id: city.id });
        setFavoriteCities(prev => [city, ...prev]);
      }
    } else {
      // Guest mode
      let updated: City[];
      if (isFav) {
        updated = favoriteCities.filter(c => c.id !== city.id);
      } else {
        updated = [city, ...favoriteCities];
      }
      setFavoriteCities(updated);
      localStorage.setItem(GUEST_CITIES_KEY, JSON.stringify(updated));
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteDishes,
        favoriteCities,
        isDishFavorite,
        isCityFavorite,
        toggleDishFavorite,
        toggleCityFavorite,
        isLoading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

