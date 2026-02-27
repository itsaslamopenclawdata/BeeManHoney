/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFA726', // Honey Gold
        secondary: '#D46F00', // Deep Amber
        background: '#FDF8E4', // Cream
        text: '#4A2C2A', // Dark Brown
        highlight: '#9CCC65',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Poppins"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}