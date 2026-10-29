import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Utensils, Heart } from 'lucide-react';
import { City } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface CityCardProps {
  city: City;
}

export const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const { isCityFavorite, toggleCityFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const isFav = isCityFavorite(city.id);

  const fallbackImage = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative bg-white rounded-2xl border border-brand-cream-dark shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-cream">
        <img
          src={imageError || !city.banner_image ? fallbackImage : city.banner_image}
          alt={city.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/85 via-brand-brown/30 to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleCityFavorite(city);
          }}
          aria-label={isFav ? "Remove city from favorites" : "Add city to favorites"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
            isFav
              ? 'bg-brand-orange text-white shadow-md'
              : 'bg-white/90 text-brand-brown hover:text-brand-orange'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Region Badge */}
        <span className="absolute top-3 left-3 bg-brand-green/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {city.region} India
        </span>

        {/* City & State bottom overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-serif text-xl font-bold tracking-tight flex items-center gap-1.5 drop-shadow-sm">
            <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
            {city.name}
          </h3>
          <p className="text-xs text-brand-cream/90 font-medium pl-6">
            {city.state}
          </p>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-brand-brown-muted line-clamp-2 leading-relaxed mb-4">
          {city.description}
        </p>

        <div className="pt-3 border-t border-brand-cream-dark flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-brown flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-brand-orange" />
            {city.dish_count > 0 ? `${city.dish_count} signature dishes` : 'Culinary destination'}
          </span>
          <Link
            to={`/destinations/${city.id}`}
            className="text-xs font-semibold text-brand-green hover:text-brand-green-dark"
          >
            Explore Place &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

