/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aera: {
          arena: '#e9e4e1',
          oliva: '#5e8b4e',
          carbon: '#2f2f2f',
        },
        primary: {
          50: '#f5f1ef',
          100: '#e9e4e1',
          200: '#d3c9c3',
          300: '#bdaea5',
          400: '#a79387',
          500: '#5e8b4e',
          600: '#4b6f3e',
          700: '#38542f',
          800: '#25381f',
          900: '#121c10',
        },
        instagram: {
          purple: '#833AB4',
          pink: '#FD1D1D',
          orange: '#FCAF45',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
