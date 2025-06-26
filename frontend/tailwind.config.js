/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        launch: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-150%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        drift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100px)' },
        },
      },
      animation: {
        'rocket-launch': 'launch 2s ease-out forwards',
        'fade-in': 'fadeIn 1.5s ease-in forwards',
        'twinkle': 'twinkle 1.5s infinite ease-in-out',
        'drift': 'drift 30s linear infinite',
      },
      fontFamily: {
        jetbrains: ['"JetBrains Mono"', 'monospace'],
        michroma: ['"Michroma"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}