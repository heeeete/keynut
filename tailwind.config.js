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
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      margin: {
        'bottom-nav-heigth': 'calc(50px + env(safe-area-inset-bottom))',
      },
      fontSize: {
        xxs: ['0.5rem', '0.75rem'], // [fontSize, lineHeight]
      },
      flex: {
        0.5: '0.5',
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.bottom-nav-calc-heigth': {
          height: 'calc(50px + env(safe-area-inset-bottom))',
        },
        '.radio-checked-before::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '10px', // 원하는 크기로 조정
          height: '10px', // 원하는 크기로 조정
          'border-radius': '50%',
          'background-color': '#000', // Tailwind CSS의 blue-500 색상
        },
      };

      addUtilities(newUtilities);
    },
    require('tailwind-scrollbar-hide'),
  ],
};
