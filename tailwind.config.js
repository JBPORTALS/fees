/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        "primary":"#F8F9FA",
        "secondary":"#FBFCFD",
        "brand":"#4945FF",
        "brandLight":"#ECEEF0",
        "black":"#252525",
        "lightgray":"#dddddd"
      }
    },
  },
  plugins: [],
}
