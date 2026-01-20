/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      body: ['Poppins', 'sans-serif'],
      sans: ['Poppins', 'sans-serif'],
      heading: ['Ubuntu', 'sans-serif']
    },
    colors: {
      dark: "#0a0a0a",
      light: "#fafafa",
      primary: {
        50: '#fef3f2',
        100: '#fee4e2',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e',
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
        950: '#6b0f2a',
      },
      accent: {
        50: '#fef3f2',
        100: '#fee4e2',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e',
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
        950: '#6b0f2a',
      },
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
      },
    }
  },
};
export const plugins = [];