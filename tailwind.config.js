module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    backgroundColor: (theme) => ({
      ...theme('colors'),
      primary: '#1B2559',
      secondary: '#ffed4a',
      danger: '#e3342f',
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
