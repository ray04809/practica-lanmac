/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lanmac: { DEFAULT: '#1E5DAA', dark: '#0D3A6E', light: '#4A8BD4' },
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        streak: '#f97316',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
