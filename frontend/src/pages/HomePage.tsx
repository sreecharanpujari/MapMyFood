import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Navigation, Compass, Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { City, Dish } from '../types';
import { FoodCard } from '../components/FoodCard';
import { CityCard } from '../components/CityCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDishes, setFeaturedDishes] = useState<Dish[]>([]);
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [dishesData, citiesData] = await Promise.all([
          api.getDishes({ limit: 8 }),
          api.getCities({ limit: 6 })
        ]);
        setFeaturedDishes(dishesData);
        setPopularCities(citiesData);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const regions = [
    { label: 'All India', value: 'All' },
    { label: 'South India', value: 'South' },
    { label: 'North India', value: 'North' },
    { label: 'East India', value: 'East' },
    { label: 'West India', value: 'West' },
  ];

  const filteredDishes = selectedRegion === 'All'
    ? featuredDishes
    : featuredDishes.filter(d => {
        const matchingCity = popularCities.find(c => c.id === d.city_id);
        return matchingCity?.region === selectedRegion;
      });

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-orange-light/50 via-transparent to-transparent -z-10" />
        
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-orange/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-orange/30 shadow-subtle text-xs font-semibold text-brand-orange animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Discover India's Living Culinary Atlas</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-brown leading-[1.15]">
            India's Flavours, <br className="hidden sm:inline" />
            <span className="text-brand-orange italic">One Place</span> at a Time.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-brand-brown-muted leading-relaxed">
            Every city in India has a story etched in spices, bread, and tradition. 
            Explore authentic regional dishes, understand their cultural roots, and discover where to taste them.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl shadow-card border border-brand-cream-dark p-2 transition-shadow focus-within:shadow-card-hover focus-within:border-brand-orange">
              <Search className="w-5 h-5 text-brand-brown-muted ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (e.g. Hyderabad, Chennai) or dish (e.g. Biryani, Kulcha)..."
                className="w-full px-3 py-3 text-sm text-brand-brown placeholder-brand-brown-muted/70 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
              >
                Find Food
              </button>
            </div>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/explore?nearMe=true')}
              className="bg-brand-green hover:bg-brand-green-dark text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-subtle flex items-center gap-2 transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Explore Food Near Me</span>
            </button>
            <Link
              to="/explore"
              className="bg-white hover:bg-brand-cream text-brand-brown text-sm font-semibold px-5 py-3 rounded-xl border border-brand-cream-dark shadow-subtle flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-brand-orange" />
              <span>Browse Interactive Map</span>
            </Link>
          </div>

          {/* Starter Discoveries Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-brand-brown-muted">
            <span className="font-semibold text-brand-brown">Popular right now:</span>
            {[
              { label: 'Hyderabadi Biryani', query: 'Hyderabadi Dum Biryani' },
              { label: 'Chennai Dosa', query: 'Masala Dosa' },
              { label: 'Amritsari Kulcha', query: 'Amritsari Kulcha' },
              { label: 'Kolkata Kathi Roll', query: 'Kathi Roll' },
              { label: 'Mumbai Vada Pav', query: 'Vada Pav' },
              { label: 'Lucknow Galouti Kebab', query: 'Galouti Kebab' },
            ].map((tag) => (
              <button
                key={tag.label}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(tag.query)}`)}
                className="bg-white/80 hover:bg-brand-orange hover:text-white border border-brand-cream-dark px-3 py-1 rounded-full transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Indian Regional Food Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Signature Flavours</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-brown">
              Featured Regional Masterpieces
            </h2>
            <p className="text-sm text-brand-brown-muted mt-1 max-w-xl">
              Authentic Indian regional foods with deep cultural origins, distinct cooking techniques, and unforgettable taste profiles.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-brand-cream p-1 rounded-2xl border border-brand-cream-dark self-start md:self-auto">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedRegion(r.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  selectedRegion === r.value
                    ? 'bg-white text-brand-orange shadow-xs'
                    : 'text-brand-brown-muted hover:text-brand-brown'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl border border-brand-cream-dark animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDishes.slice(0, 8).map((dish) => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/dishes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-brand-cream text-brand-brown font-semibold text-sm rounded-xl border border-brand-cream-dark shadow-subtle transition-all"
          >
            <span>Explore All Regional Dishes</span>
            <ArrowRight className="w-4 h-4 text-brand-orange" />
          </Link>
        </div>
      </section>

      {/* Popular Food Destinations (Cities) */}
      <section className="bg-brand-cream-dark/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand-green text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>Culinary Capitals</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-brown">
                Iconic Food Destinations
              </h2>
              <p className="text-sm text-brand-brown-muted mt-1 max-w-xl">
                Explore the historic culinary traditions of cities where food is an emotion, from the Nizami alleys of Hyderabad to the tandoors of Amritsar.
              </p>
            </div>
            <Link
              to="/destinations"
              className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1 self-start md:self-auto"
            >
              View All Destinations &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCities.slice(0, 6).map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* Regional Cuisine Overview Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-brand-brown text-white p-8 sm:p-12 overflow-hidden shadow-card">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Culinary Heritage &bull; Honest Exploration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Every Region Tells a Delicious Story.
            </h2>
            <p className="text-sm text-brand-cream/80 leading-relaxed">
              We focus on food origin, cooking philosophy, and authenticity. No invented ratings, no fabricated restaurant partnerships. Pure culinary documentation built for passionate food lovers.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Launch Interactive Atlas</span>
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Learn About Our Philosophy</span>
              </Link>
            </div>
          </div>

          {/* Background graphical accent */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
};

