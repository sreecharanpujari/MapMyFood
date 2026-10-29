import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, MapPin, Utensils, Trash2 } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { FoodCard } from '../components/FoodCard';
import { CityCard } from '../components/CityCard';

export const FavoritesPage: React.FC = () => {
  const { favoriteDishes, favoriteCities, isLoading } = useFavorites();
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'dishes' | 'cities'>('dishes');

  const totalDishes = favoriteDishes.length;
  const totalCities = favoriteCities.length;
  const totalFavs = totalDishes + totalCities;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-current" />
            <span>Saved Collections</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-brown">
            Your Food Discoveries
          </h1>
          <p className="text-xs sm:text-sm text-brand-brown-muted mt-1 max-w-xl">
            {user
              ? `Saved to your explorer account (${user.email}). Synced across your sessions.`
              : 'Preserved locally on this browser. Create a free account anytime to sync across devices.'}
          </p>
        </div>

        {!user && (
          <button
            onClick={() => openAuthModal('register')}
            className="px-4 py-2 bg-brand-cream hover:bg-brand-cream-dark text-brand-orange border border-brand-orange/30 text-xs font-semibold rounded-xl transition-all self-start sm:self-auto"
          >
            Create Account to Sync &rarr;
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-brand-cream-dark pb-4">
        <button
          onClick={() => setActiveTab('dishes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dishes'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'bg-white text-brand-brown hover:bg-brand-cream'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Saved Dishes ({totalDishes})</span>
        </button>

        <button
          onClick={() => setActiveTab('cities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cities'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'bg-white text-brand-brown hover:bg-brand-cream'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Destinations ({totalCities})</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-brand-cream-dark" />
          ))}
        </div>
      ) : activeTab === 'dishes' ? (
        totalDishes > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <EmptyFavoritesState
            title="No Saved Dishes Yet"
            description="Explore authentic Indian regional dishes on the interactive map or browse our catalog, then click the heart icon to save them here."
            actionText="Discover Regional Dishes"
            actionLink="/dishes"
          />
        )
      ) : totalCities > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      ) : (
        <EmptyFavoritesState
          title="No Saved Destinations Yet"
          description="Bookmark culinary capitals like Hyderabad, Chennai, Amritsar, or Kolkata to easily revisit their culinary traditions and signature foods."
          actionText="Explore Culinary Cities"
          actionLink="/destinations"
        />
      )}
    </div>
  );
};

const EmptyFavoritesState: React.FC<{
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
}> = ({ title, description, actionText, actionLink }) => (
  <div className="bg-white rounded-3xl p-12 text-center border border-brand-cream-dark shadow-subtle space-y-4 max-w-lg mx-auto">
    <div className="w-16 h-16 rounded-full bg-brand-orange-light text-brand-orange mx-auto flex items-center justify-center">
      <Heart className="w-8 h-8" />
    </div>
    <h3 className="font-serif text-2xl font-bold text-brand-brown">{title}</h3>
    <p className="text-xs text-brand-brown-muted leading-relaxed">{description}</p>
    <div className="pt-2">
      <Link
        to={actionLink}
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
      >
        <Compass className="w-4 h-4" />
        <span>{actionText}</span>
      </Link>
    </div>
  </div>
);

