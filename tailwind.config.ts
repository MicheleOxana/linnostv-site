import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: '#00FF84',
        neonPink: '#FF4DD8',
        neonBlue: '#4DA6FF',
        neonPurple: '#A64DFF'
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        shimmer: 'shimmer 12s linear infinite'
      },
      boxShadow: {
        glow: '0 0 30px rgba(164, 77, 255, 0.6)'
      }
    }
  },
  plugins: []
}
export default config
