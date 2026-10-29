import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync mode with context
  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await register(email, password, fullName);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-brand-brown/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal border border-brand-cream-dark p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-brand-brown-muted hover:text-brand-brown hover:bg-brand-cream transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange mb-3">
            <img src="/logo.svg" alt="Map My Food" className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-brown">
            {mode === 'login' ? 'Welcome Back' : 'Join Map My Food'}
          </h2>
          <p className="text-xs text-brand-brown-muted mt-1">
            {mode === 'login'
              ? 'Sign in to access your saved regional dishes and destinations.'
              : 'Create an explorer account to bookmark food discoveries across devices.'}
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex bg-brand-cream rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-brand-brown shadow-sm'
                : 'text-brand-brown-muted hover:text-brand-brown'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-brand-brown shadow-sm'
                : 'text-brand-brown-muted hover:text-brand-brown'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-brand-brown mb-1.5">
                Full Name (Optional)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-brown-muted" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-cream/50 border border-brand-cream-dark rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white text-brand-brown"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-brand-brown mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-brown-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-cream/50 border border-brand-cream-dark rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white text-brand-brown"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-brown mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-brown-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-cream/50 border border-brand-cream-dark rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white text-brand-brown"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99]"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Guest reassurance */}
        <p className="text-[11px] text-center text-brand-brown-muted mt-5">
          Browsing as a guest? Your favorites are automatically preserved locally on this browser.
        </p>
      </div>
    </div>
  );
};

