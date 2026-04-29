/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          parchment: '#F5F1E8',
          ink: '#1A1A1A',
          accent: '#C8102E',
          verified: '#2D5016',
          warning: '#B8860B',
        },
        fontFamily: {
          display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
          mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
        },
        boxShadow: {
          'brutal': '4px 4px 0 0 #1A1A1A',
          'brutal-red': '4px 4px 0 0 #C8102E',
          'brutal-lg': '6px 6px 0 0 #1A1A1A',
        },
      },
    },
    plugins: [],
  }