/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rolex: {
          DEFAULT: '#006039', // Vert Rolex emblématique
          50: '#E8F5EE',
          100: '#C7E7D4',
          200: '#94D0AD',
          300: '#5CB582',
          400: '#2C9B5D',
          500: '#006039',
          600: '#004F2F',
          700: '#003F25',
          800: '#002E1B',
          900: '#001E12',
          950: '#00130B',
          dark: '#071510',
          forest: '#0B2218',
        },
        gold: {
          DEFAULT: '#C6A15B', // Or / Champagne de référence
          light: '#E5CCA0',
          champagne: '#F3E5C8',
          dark: '#A6823C',
          bright: '#D4AF37',
          50: '#FAF6ED',
          100: '#F4ECD4',
          200: '#E7D5A4',
          300: '#DABF74',
          400: '#C6A15B',
          500: '#B08842',
          600: '#8C6B2F',
        },
        obsidian: {
          DEFAULT: '#0D1110',
          light: '#161B19',
          card: '#111714',
          border: '#1F2A24',
        },
        surface: {
          DEFAULT: '#F8F9FA',
          pure: '#FFFFFF',
          cream: '#FAF8F5',
          muted: '#EFECE6',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(198, 161, 91, 0.35)',
        'rolex-glow': '0 0 30px -5px rgba(0, 96, 57, 0.4)',
        'luxury-card': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'luxury-hover': '0 20px 40px -15px rgba(0, 96, 57, 0.2), 0 0 20px -5px rgba(198, 161, 91, 0.25)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at center, transparent 40%, rgba(7, 21, 16, 0.85) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F3E5C8 0%, #C6A15B 50%, #A6823C 100%)',
        'rolex-gradient': 'linear-gradient(135deg, #006039 0%, #003F25 100%)',
        'dark-rolex-gradient': 'linear-gradient(180deg, #071510 0%, #0B2218 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
