/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        background: '#191B21',
        main_light: '#22252E',
        main_light_opacity_50: '#E9B21A50',
        main_dark: '#E5E5E5',
        menu_dark: '#5191FA',
        yellow_text: '#F4C851',
        yellow_button: '#E9B21A',
        // yellow_gradient: ['#F4C851', '#EBAF09'],
        main_red: '#DA1B1B',
        dark_stroke: '#292B33',
        main_grey: '#4A4D55',
      },
      fontFamily: {
        muller_light: ['Muller Light'],
        muller_regular: ['Muller Regular'],
        muller_medium: ['Muller Medium'],
        muller_bold: ['Muller Bold'],
        graphie: ['Graphie'],
      },
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))',
      },
      backgroundImage: {
        // 'main-bg': "url('./src/assets/background.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
};
