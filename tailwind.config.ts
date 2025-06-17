import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        playfair: ['var(--font-playfair)'],
      },      animation: {
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        'button-hover': 'button-hover 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px 2px rgba(230, 28, 113, 0.3)' },
          '50%': { boxShadow: '0 0 30px 4px rgba(230, 28, 113, 0.5)' },
        },
        'button-hover': {
          '0%, 100%': { transform: 'scale(1) translateY(-4px)' },
          '50%': { transform: 'scale(1.02) translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config