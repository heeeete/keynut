const { openAsBlob } = require('fs');

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
      fontSize: {
        xxs: ['0.5rem', '0.75rem'], // [fontSize, lineHeight]
      },
      flex: {
        0.9: '0.9',
        0.8: '0.8',
        0.7: '0.7',
        0.6: '0.6',
        0.5: '0.5',
        0.4: '0.4',
        0.3: '0.3',
        0.2: '0.2',
        0.1: '0.1',
      },
      width: {
        '10vw': '10vw',
        '20vw': '20vw',
        '30vw': '30vw',
        '40vw': '40vw',
        '50vw': '50vw',
        '60vw': '60vw',
        '70vw': '70vw',
        '80vw': '80vw',
        '85vw': '85vw',
        '90vw': '90vw',
        '100vw': '100vw',
        'd-screen': '100dvw',
        450: '450px',
        350: '350px',
        130: '130px',
        6.5: '1.65rem',
        85: '85px',
      },
      height: {
        '10vh': '10vh',
        '20vh': '20vh',
        '30vh': '30vh',
        '40vh': '40vh',
        '50vh': '50vh',
        '60vh': '60vh',
        '70vh': '70vh',
        '80vh': '80vh',
        '85vh': '85vh',
        '90vh': '90vh',
        '100vh': '100vh',
        '10dvh': '10dvh',
        '20dvh': '20dvh',
        '30dvh': '30dvh',
        '40dvh': '40dvh',
        '50dvh': '50dvh',
        '60dvh': '60dvh',
        '70dvh': '70dvh',
        '80dvh': '80dvh',
        '85dvh': '85dvh',
        '90dvh': '90dvh',
        '100dvh': '100dvh',
        '10vw': '10vw',
        '20vw': '20vw',
        '30vw': '30vw',
        '40vw': '40vw',
        '50vw': '50vw',
        '60vw': '60vw',
        '70vw': '70vw',
        '80vw': '80vw',
        '85vw': '85vw',
        '90vw': '90vw',
        '100vw': '100vw',
        'd-screen': '100dvh',
        52.5: '52.5px',
        130: '130px',
        500: '500px',
        6.5: '1.65rem',
      },
      backgroundColor: {
        'gray-5': '#D9D9D9',
        main: 'rgb(250 245 255)',
        'dark-main': 'rgb(216 180 254)',
      },
      margin: {
        '12vw': '12vw',
        'bottom-nav-height': 'calc(50px + env(safe-area-inset-bottom))',
      },
      spacing: {
        30: '30px',
        34: '136px',
        205: '205px',
        250: '250px',
        '70vh': '70vh',
        '50vh': '50vh',
        '60vh': '60vh',
      },
      filter: {
        none: 'none',
        'pink-blur': 'url(#fuzzy-pink)',
      },
      minWidth: {
        600: '600px',
        300: '300px',
        10: '10px',
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
      },
      keyframes: {
        loading: {
          '0%': {
            transform: 'translateX(0%)',
          },

          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        loading: 'loading 1s infinite',
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.bottom-nav-calc-height': {
          height: 'calc(50px + env(safe-area-inset-bottom))',
        },
        '.custom-dvh': {
          height: '100vh',
          height: 'calc(var(--vh, 1vh) * 100)',
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
          'background-color': '#000', // 원하는 색상으로 조정
        },
        '.radio-hover::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30px', // 원하는 크기로 조정
          height: '30px', // 원하는 크기로 조정
          'border-radius': '50%',
          'background-color': '#000', // 원하는 색상으로 조정
          opacity: 0.1,
        },
        '.nav-1280': {
          height: '6rem',
        },
        '.nav-768': {
          height: '3.5rem',
        },
        '.main-1280': {
          paddingTop: '8rem',
        },
        '.main-768': {
          paddingTop: '4rem',
        },
        '.search-bar-container-md': {
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '96px',
        },
        '.search-bar-container-maxmd': {
          minHeight: '56px',
          height: '56px',
          padding: '8px 12px',
        },
        '.search-bar-md': {
          display: 'flex',
          borderRadius: '0',
          borderBottom: '1px solid black',
          width: '450px',
          padding: '4px',
          // backgroundColor: 'blue',
        },
        '.search-bar-maxmd': {
          borderRadius: '4px',
          border: 'none',
          width: '100%',
          height: '100%',
          // padding: '0px 12px',
          backgroundColor: 'rgb(243 244 246)',
        },
        '.defualt-profile': {
          display: 'flex',
          backgroundColor: 'rgb(243,244,246)',
          // border: '2px solid rgb(243,244,246)',
          borderRadius: '50%',
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
        },
        // flex gap-2 flex-wrap px-2
        '.filter-container': {
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '10px 16px',
        },
        '.filter-button': {
          display: 'flex',
          padding: '4px 16px',
          border: '1px solid gray',
          borderRadius: '16px',
          borderColor: '#e5e7eb',
          fontSize: '15px',
          // color: '#6b7280',
        },
      };
      //max-md:rounded max-md:px-3 max-md:bg-gray-100 max-md:w-full max-md:h-full
      addUtilities(newUtilities);
    },
    require('tailwind-scrollbar-hide'),
  ],
};
