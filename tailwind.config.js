/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lanmac: { DEFAULT: '#2563EB', dark: '#1d4ed8', light: '#60a5fa' },
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
