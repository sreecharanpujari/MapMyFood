import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Flame, MapPin } from 'lucide-react';
import { Dish } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface FoodCardProps {
  dish: Dish;
}

export const FoodCard: React.FC<FoodCardProps> = ({ dish }) => {
  const { isDishFavorite, toggleDishFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const isFav = isDishFavorite(dish.id);

  const fallbackImage = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative bg-white rounded-2xl border border-brand-cream-dark shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream">
        <img
          src={imageError || !dish.image_url ? fallbackImage : dish.image_url}
          alt={dish.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/70 via-transparent to-transparent opacity-80" />

        {/* Dietary symbol (Traditional Indian Veg / Non-Veg badge) */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
          <div
            className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
              dish.dietary === 'Vegetarian' ? 'border-green-600' : 'border-red-700'
            }`}
            title={dish.dietary}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                dish.dietary === 'Vegetarian' ? 'bg-green-600' : 'bg-red-700'
              }`}
            />
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleDishFavorite(dish);
          }}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
            isFav
              ? 'bg-brand-orange text-white shadow-md'
              : 'bg-white/90 text-brand-brown hover:text-brand-orange'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* City and State pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1 bg-brand-brown/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
            {dish.city_name || dish.state}
          </span>
          <span className="bg-brand-green/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {dish.cuisine_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-green bg-brand-green-light px-2 py-0.5 rounded">
              {dish.category}
            </span>
            <span className="text-[11px] font-medium text-brand-brown-muted flex items-center gap-1">
              <Flame className="w-3 h-3 text-brand-orange" />
              {dish.spice_level}
            </span>
            {dish.is_sample && (
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Sample
              </span>
            )}
          </div>

          <Link to={`/dishes/${dish.id}`} className="block group-hover:text-brand-orange transition-colors">
            <h3 className="font-serif text-lg font-bold text-brand-brown line-clamp-1 mb-1.5">
              {dish.name}
            </h3>
          </Link>

          <p className="text-xs text-brand-brown-muted line-clamp-2 leading-relaxed mb-4">
            {dish.description}
          </p>
        </div>

        <div className="pt-3 border-t border-brand-cream-dark flex items-center justify-between">
          <span className="text-xs font-medium text-brand-brown-muted">
            Origin: <strong className="text-brand-brown">{dish.state}</strong>
          </span>
          <Link
            to={`/dishes/${dish.id}`}
            className="text-xs font-semibold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1"
          >
            Explore Dish &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

