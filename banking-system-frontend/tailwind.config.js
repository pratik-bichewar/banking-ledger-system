/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#6366F1',
        secondary:  '#885CF6',
        success:    '#10B981',
        danger:     '#EF4444',
        warning:    '#F59E0B',
        'light-bg': '#F1F5F9',
        'dark-bg':  '#0F172A',
        'text-muted': '#647488',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #6366F1 0%, #885CF6 100%)',
        'dark-sidebar': 'linear-gradient(180deg, #0F172A 0%, #151233 100%)',
      },
      boxShadow: {
        'card': '0 8px 24px -8px rgba(99,102,241,0.15)',
        'card-hover': '0 12px 28px -6px rgba(99,102,241,0.25)',
        'btn': '0 4px 14px -2px rgba(99,102,241,0.4)',
      },
      borderRadius: {
        '2xl': '16px',
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
