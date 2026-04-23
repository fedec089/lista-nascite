/** @type {import('tailwindcss').Config} */

const withAlpha = (variable) => `oklch(from var(${variable}) l c h / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Young Serif"', 'ui-serif', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: withAlpha('--color-paper'),
        ink: withAlpha('--color-ink'),
        'ink-muted': withAlpha('--color-ink-muted'),
        'ink-soft': withAlpha('--color-ink-soft'),
        hairline: withAlpha('--color-hairline'),
        sky: withAlpha('--color-sky'),
        'sky-strong': withAlpha('--color-sky-strong'),
        'sky-surface': withAlpha('--color-sky-surface'),
        honey: withAlpha('--color-honey'),
        'honey-surface': withAlpha('--color-honey-surface'),
        blush: withAlpha('--color-blush'),
      },
      letterSpacing: {
        label: '0.18em',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'panel-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        'panel-in': 'panel-in 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
