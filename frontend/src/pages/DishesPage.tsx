import React, { useState, useEffect } from 'react';
import { Search, Compass, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Dish } from '../types';
import { FoodCard } from '../components/FoodCard';

export const DishesPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [category, setCategory] = useState('');
  const [dietary, setDietary] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const data = await api.getDishes({
        search: search || undefined,
        cuisine: cuisine || undefined,
        category: category || undefined,
        dietary: dietary || undefined,
        sort: sort,
        limit: 50
      });
      setDishes(data);
    } catch (err) {
      console.error('Failed to fetch dishes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [cuisine, category, dietary, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDishes();
  };

  const handleReset = () => {
    setSearch('');
    setCuisine('');
    setCategory('');
    setDietary('');
    setSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Regional Culinary Catalog</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-brown">
          Discover Authentic Indian Dishes
        </h1>
        <p className="text-xs sm:text-sm text-brand-brown-muted mt-1 max-w-xl">
          Browse our curated catalog of regional food specialties, from historic tiffin snacks to royal banquet curries.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-cream-dark shadow-subtle space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-brown-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by dish name, spice, or ingredient..."
              className="w-full pl-10 pr-4 py-2.5 bg-brand-cream/40 border border-brand-cream-dark rounded-xl text-sm focus:outline-none focus:border-brand-orange text-brand-brown"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="px-3 py-2.5 bg-brand-cream/40 border border-brand-cream-dark rounded-xl text-xs font-medium text-brand-brown focus:outline-none focus:border-brand-orange"
            >
              <option value="">All Cuisines</option>
              <option value="Awadhi">Awadhi</option>
              <option value="Hyderabadi">Hyderabadi</option>
              <option value="Punjabi">Punjabi</option>
              <option value="South Indian">South Indian</option>
              <option value="Bengali">Bengali</option>
              <option value="Maharashtrian">Maharashtrian</option>
              <option value="Rajasthani">Rajasthani</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Kerala Coastal">Kerala Coastal</option>
              <option value="Kashmiri">Kashmiri</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 bg-brand-cream/40 border border-brand-cream-dark rounded-xl text-xs font-medium text-brand-brown focus:outline-none focus:border-brand-orange"
            >
              <option value="">All Categories</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Main Course">Main Course</option>
              <option value="Street Food">Street Food</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
            </select>

            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="px-3 py-2.5 bg-brand-cream/40 border border-brand-cream-dark rounded-xl text-xs font-medium text-brand-brown focus:outline-none focus:border-brand-orange"
            >
              <option value="">All Dietary</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 bg-brand-cream/40 border border-brand-cream-dark rounded-xl text-xs font-medium text-brand-brown focus:outline-none focus:border-brand-orange"
            >
              <option value="newest">Newest Added</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset filters"
              className="p-2.5 bg-brand-cream hover:bg-brand-cream-dark text-brand-brown rounded-xl transition-colors shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Dishes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-brand-brown">
            Catalogued Regional Dishes ({dishes.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl border border-brand-cream-dark animate-pulse" />
            ))}
          </div>
        ) : dishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white rounded-3xl border border-brand-cream-dark text-center space-y-3">
            <p className="font-serif text-lg font-bold text-brand-brown">No dishes found</p>
            <p className="text-xs text-brand-brown-muted">Try adjusting your filters or search keywords.</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-brand-orange text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

