/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'grid-cols-[repeat(0,_13px)]',
    'grid-cols-[repeat(1,_13px)]',
    'grid-cols-[repeat(2,_13px)]',
    'grid-cols-[repeat(3,_13px)]',
    'grid-cols-[repeat(4,_13px)]',
    'grid-cols-[repeat(5,_13px)]',
    'grid-cols-[repeat(6,_13px)]',
    'grid-cols-[repeat(7,_13px)]',
    'grid-cols-[repeat(8,_13px)]',
    'grid-cols-[repeat(9,_13px)]',
    'grid-cols-[repeat(10,_13px)]',
    'grid-cols-[repeat(11,_13px)]',
    'grid-cols-[repeat(12,_13px)]',
    'grid-cols-[repeat(13,_13px)]',
    'grid-cols-[repeat(14,_13px)]',
    'grid-cols-[repeat(15,_13px)]',
    'grid-cols-[repeat(16,_13px)]',
    'grid-cols-[repeat(0,_61px)]',
    'grid-cols-[repeat(1,_61px)]',
    'grid-cols-[repeat(2,_61px)]',
    'grid-cols-[repeat(3,_61px)]',
    'grid-cols-[repeat(4,_61px)]',
    'grid-cols-[repeat(5,_61px)]',
    'grid-cols-[repeat(6,_61px)]',
    'grid-cols-[repeat(7,_61px)]',
    'grid-cols-[repeat(8,_61px)]',
    'grid-cols-[repeat(9,_61px)]',
    'grid-cols-[repeat(10,_61px)]',
    'grid-cols-[repeat(11,_61px)]',
    'grid-cols-[repeat(12,_61px)]',
    'grid-cols-[repeat(13,_61px)]',
    'grid-cols-[repeat(14,_61px)]',
    'grid-cols-[repeat(15,_61px)]',
    'grid-cols-[repeat(16,_61px)]'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // adding more of these for my widest grids
        13: 'repeat(13, minmax(0, 1fr))',
        14: 'repeat(14, minmax(0, 1fr))',
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))'
      }
    }
  },
  plugins: [require('daisyui')]
}
