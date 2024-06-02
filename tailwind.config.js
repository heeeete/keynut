/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      aspectRatio: {
        '4/5': '4 / 5',
      },
      width: {
        '12vw': '12vw',
        '70vw': '70vw',
        '80vw': '80vw',
        '85vw': '85vw',
        '90vw': '90vw',
      },
      height: {
        '70vh': '70vh',
        '80vh': '80vh',
        '85vh': '85vh',
        '90vh': '90vh',
        '100vh': '100vh',
      },
      backgroundColor: {
        'gray-5': '#D9D9D9',
      },
      margin: {
        '12vw': '12vw',
      },
      spacing: {
        34: '136px',
        205: '205px',
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {};

      addUtilities(newUtilities);
    },
    require('tailwind-scrollbar-hide'),
  ],
};
