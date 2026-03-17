/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            brand: {
                dark: '#0f172a', // Slate 900
                purple: '#4c1d95', // Violet 900
                accent: '#8b5cf6', // Violet 500
                glow: '#a78bfa', // Violet 400
                teal: '#2dd4bf', // Teal 400
            }
        },
    },
  },
  plugins: [],
}