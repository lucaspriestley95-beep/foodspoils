/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Fresh Greens
        fresh: {
          50: '#F0FFF4',
          100: '#D4EDDA',
          200: '#A8E6B6',
          400: '#4ADE80',
          500: '#22C55E', // Primary brand
          600: '#16A34A',
          700: '#15803D',
          900: '#14532D',
        },
        // Accent — Warm Coral
        coral: {
          400: '#FD8B64',
          500: '#FF6B35', // Primary accent
          600: '#E85D26',
        },
        // Status colors for expiry
        status: {
          fresh: '#22C55E',
          soon: '#FACC15',
          urgent: '#FF6B35',
          expired: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      boxShadow: {
        'glow-green': '0 0 12px rgba(34, 197, 94, 0.3)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};