/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f3faf6',
          100: '#e7f3ec',
          500: '#2d9a63',
          600: '#1f7a4d',
          700: '#1b4d38',
          800: '#143528',
          900: '#0c1f18',
          950: '#06140f',
        },
        gold: {
          400: '#e0c25a',
          500: '#d4af37',
          600: '#b8922a',
        },
        mist: '#eef4f0',
        cloud: '#f7faf8',
        ink: '#14201a',
        alert: '#c45c26',
        warn: '#c4922a',
      },
      fontFamily: {
        display: ['Fraunces_600SemiBold'],
        'display-bold': ['Fraunces_700Bold'],
        sans: ['Sora_400Regular'],
        'sans-medium': ['Sora_500Medium'],
        'sans-semibold': ['Sora_600SemiBold'],
      },
    },
  },
  plugins: [],
};
