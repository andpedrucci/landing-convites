import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Raleway', 'system-ui', 'sans-serif'],
      },
      colors: {
        beige: {
          50: '#FAF8F5',
          100: '#F5EDE3',
          200: '#E8DCC8',
          300: '#D4A574',
          400: '#C09464',
        },
        rose: {
          100: '#F9E8EA',
          200: '#E8B4BC',
        },
        brown: {
          600: '#8B7355',
          700: '#5C4A3F',
        }
      }
    },
  },
  plugins: [],
}
export default config
