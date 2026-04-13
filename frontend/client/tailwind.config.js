/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#E8F9FF',
          100: '#C4D9FF',
          200: '#C4D9FF',
          300: '#C5BAFF',
          400: '#C5BAFF',
          500: '#8B7FD4',
          600: '#6C5FBF',
          700: '#4E3FAA',
        },
        surface: '#FBFBFB',
        'sky-soft': '#E8F9FF',
        periwinkle: '#C4D9FF',
        lavender: '#C5BAFF',
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
