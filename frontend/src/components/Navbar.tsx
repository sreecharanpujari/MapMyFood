import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Compass, Heart, Info, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, openAuthModal } = useAuth();
  const { favoriteDishes, favoriteCities } = useFavorites();

  const totalFavs = favoriteDishes.length + favoriteCities.length;

  const navLinks = [
    { name: 'Explore Map', path: '/explore', icon: Map },
    { name: 'Discover Dishes', path: '/dishes', icon: Compass },
    { name: 'Destinations', path: '/destinations', icon: Compass },
    { name: 'Favorites', path: '/favorites', icon: Heart, count: totalFavs },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-[1100] bg-white/95 backdrop-blur-md border-b border-brand-cream-dark transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-brand-orange-light border border-brand-orange/20 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="Map My Food Pin" className="w-7 h-7" />
            </div>
            <div>
              <span className="font-serif text-2xl font-black tracking-tight text-brand-brown group-hover:text-brand-orange transition-colors">
                Map My Food
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-green">
                Flavours of India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-brand-cream text-brand-orange shadow-xs'
                      : 'text-brand-brown hover:text-brand-orange hover:bg-brand-cream/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-orange' : 'text-brand-brown-muted'}`} />
                  <span>{link.name}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-brand-orange text-white text-[10px] font-bold rounded-full">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-brand-cream rounded-xl border border-brand-cream-dark">
                  <div className="w-7 h-7 rounded-lg bg-brand-green text-white flex items-center justify-center font-bold text-xs">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-brand-brown max-w-[120px] truncate">
                    {user.full_name || user.email.split('@')[0]}
                  </span>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1.5 text-brand-brown-muted hover:text-brand-orange rounded-lg transition-colors ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-semibold text-brand-brown hover:text-brand-orange transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Join Explorer
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/favorites"
              className="relative p-2 text-brand-brown hover:text-brand-orange"
              aria-label="View Favorites"
            >
              <Heart className="w-5 h-5" />
              {totalFavs > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalFavs}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-brand-brown hover:bg-brand-cream"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-brand-cream-dark px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-card">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                  active
                    ? 'bg-brand-cream text-brand-orange'
                    : 'text-brand-brown hover:bg-brand-cream/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-2 py-0.5 bg-brand-orange text-white text-xs font-bold rounded-full">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-brand-cream-dark mt-2">
            {user ? (
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-brand-green" />
                  <span className="text-sm font-semibold text-brand-brown">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-red-600 px-3 py-1.5 rounded-lg bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-brand-cream-dark text-brand-brown"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-brand-orange text-white shadow-sm"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

