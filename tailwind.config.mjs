/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Design system mentoria-fe
        cream: '#FDFBF5',
        bordo: {
          DEFAULT: '#7A1F3A',
          dark: '#5C1729',
          light: '#9A3A54',
        },
        gold: {
          DEFAULT: '#C9A24B',
          dark: '#A8843A',
          light: '#DDB865',
        },
        ink: '#0B0B0F',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          DEFAULT: '1140px',
        },
      },
      screens: {
        sm: '375px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
      },
    },
  },
  plugins: [],
};
