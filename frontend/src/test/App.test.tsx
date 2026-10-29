import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FoodCard } from '../components/FoodCard';
import { FavoritesProvider } from '../hooks/useFavorites';
import { AuthProvider } from '../hooks/useAuth';
import { Dish } from '../types';
import { NotFoundPage } from '../pages/NotFoundPage';

const mockDish: Dish = {
  id: 1,
  name: 'Hyderabadi Dum Biryani',
  city_id: 1,
  city_name: 'Hyderabad',
  state: 'Telangana',
  cuisine_type: 'Hyderabadi / Awadhi',
  category: 'Main Course',
  dietary: 'Non-Vegetarian',
  spice_level: 'Spicy',
  description: 'A world-renowned celebratory dish consisting of long-grain basmati rice and tender spiced meat cooked together on slow heat.',
  cultural_context: 'Originated in royal Nizami kitchens.',
  key_ingredients: 'Basmati rice, Mutton, Saffron, Ghee',
  image_url: 'https://example.com/biryani.jpg',
  is_sample: false,
  created_at: new Date().toISOString()
};

describe('FoodCard Component', () => {
  it('renders dish name, cuisine, dietary indicator, and city correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <FoodCard dish={mockDish} />
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Hyderabadi Dum Biryani')).toBeInTheDocument();
    expect(screen.getByText('Hyderabadi / Awadhi')).toBeInTheDocument();
    expect(screen.getByText('Hyderabad')).toBeInTheDocument();
    expect(screen.getByText('Main Course')).toBeInTheDocument();
    expect(screen.getByText('Spicy')).toBeInTheDocument();
  });

  it('allows guest to toggle favorite dish using local storage', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <FoodCard dish={mockDish} />
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const favButton = screen.getByLabelText(/Add to favorites/i);
    expect(favButton).toBeInTheDocument();

    fireEvent.click(favButton);

    await waitFor(() => {
      const stored = localStorage.getItem('mmf_guest_fav_dishes');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)[0].name).toBe('Hyderabadi Dum Biryani');
    });
  });
});

describe('NotFoundPage Component', () => {
  it('renders 404 message and home link', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Tastebuds Off the Map!/i)).toBeInTheDocument();
    expect(screen.getByText(/Return Home/i)).toBeInTheDocument();
  });
});

