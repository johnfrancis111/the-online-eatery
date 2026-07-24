/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "The Online Eatery" — a pot-simmering, market-stall palette.
        char: {
          950: '#150F0C', // deep espresso, near-black but warm
          900: '#1B1512',
          800: '#241C17',
          700: '#332821',
        },
        pepper: {
          DEFAULT: '#C1272D', // scotch bonnet red — primary accent
          600: '#A31F24',
          700: '#861A1E',
        },
        turmeric: {
          DEFAULT: '#E8A33D', // simmered gold — secondary accent
          400: '#F0B75C',
          600: '#C9862A',
        },
        ivory: {
          DEFAULT: '#FAF4E9',
          200: '#F5EFE6',
          300: '#E9DEC9',
        },
        basil: {
          DEFAULT: '#4C9A5D',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        pot: '0 12px 30px -12px rgba(21, 15, 12, 0.45)',
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(250,244,233,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
