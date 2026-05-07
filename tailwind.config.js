/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f5f0e8',
        charcoal: '#1a1a1a',
        rust: '#c94f2a',
        'rust-light': '#e8633a',
        sand: '#d4c5a9',
        muted: '#7a7060',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        italiana: ['var(--font-italiana)', 'serif'],
        raleway: ['var(--font-raleway)', 'sans-serif'],
      },
      animation: {
        'ticker': 'ticker 20s linear infinite',
        'ticker-reverse': 'ticker 25s linear infinite reverse',
        'float-y': 'floatY 8s ease-in-out infinite',
        'zoom-in': 'zoomIn 1.5s 0.3s cubic-bezier(0.23,1,0.32,1) forwards',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
        'fade-up-1': 'fadeUp 0.8s 0.6s forwards',
        'fade-up-2': 'fadeUp 0.9s 0.8s forwards',
        'fade-up-3': 'fadeUp 0.8s 1.0s forwards',
        'fade-up-4': 'fadeUp 0.8s 1.2s forwards',
        'fade-up-5': 'fadeUp 0.7s 1.4s forwards',
        'fade-up-6': 'fadeUp 0.7s 2.0s forwards',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(-50%) translateX(0)' },
          '50%': { transform: 'translateY(-52%) translateX(12px)' },
        },
        zoomIn: {
          'to': { transform: 'scale(1)' },
        },
        scrollPulse: {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '1' },
          '50%': { transform: 'scaleY(0.5)', opacity: '0.4' },
        },
        fadeUp: {
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
