/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        sky: {
          powder: '#d6ecf7',
          soft: '#b8dcef',
          deep: '#6aaed1',
        },
        honey: '#f6c667',
        blush: '#f4c7c3',
        cream: '#fffaf2',
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(106, 174, 209, 0.35)',
        lift: '0 20px 45px -18px rgba(106, 174, 209, 0.45)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
