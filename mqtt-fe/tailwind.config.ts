import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8fafc',
          100: '#eceff6',
          200: '#d7def0',
          300: '#bfcbe8',
          400: '#94a5d9',
          500: '#6b7fd0',
          600: '#5466b8',
          700: '#3b4a86',
          800: '#2a3560',
          900: '#111827'
        },
        muted: '#717182',
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 6px 18px rgba(15,23,42,0.06)',
        deep: '0 10px 30px rgba(2,6,23,0.2)'
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [],
}

export default config
