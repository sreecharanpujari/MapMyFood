/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B35',
          'orange-hover': '#E85924',
          'orange-light': '#FFF0EB',
          green: '#138A72',
          'green-dark': '#0E6B58',
          'green-light': '#E7F5F2',
          cream: '#FFF8EE',
          'cream-dark': '#F4E9D8',
          brown: '#241A15',
          'brown-light': '#4A3B32',
          'brown-muted': '#7A6B63',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(36, 26, 21, 0.05)',
        'card': '0 4px 20px rgba(36, 26, 21, 0.08)',
        'card-hover': '0 10px 25px rgba(36, 26, 21, 0.12)',
        'modal': '0 20px 40px rgba(36, 26, 21, 0.2)',
      }
    },
  },
  plugins: [],
}

