import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FBF8F1',
          200: '#F4EFE3',
          300: '#EAE2D0',
        },
        bottle: {
          50: '#EAF1EE',
          100: '#CBDDD6',
          300: '#7FA598',
          500: '#2C6B57',
          700: '#14493A',
          800: '#0E3A2E',
          900: '#0B2C23',
        },
        gold: {
          100: '#F5EBD2',
          200: '#E8D5A6',
          400: '#D4B45C',
          500: '#C9A227',
          600: '#A9861B',
        },
        ink: '#1A1A18',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        hebrew: ['var(--font-hebrew)', 'Frank Ruhl Libre', 'David', 'serif'],
      },
      boxShadow: {
        luxe: '0 24px 60px -30px rgba(11, 44, 35, 0.35)',
        card: '0 2px 24px -12px rgba(11, 44, 35, 0.25)',
      },
      backgroundImage: {
        'gold-line': 'linear-gradient(90deg, transparent, #C9A227, transparent)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(var(--slide-from, 100%))' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'slide-in': 'slide-in 0.28s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
