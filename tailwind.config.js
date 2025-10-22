/** @type {import('tailwindcss').Config} */
// Tailwind config used by NativeWind to scan files for classNames
module.exports = {
  // Tell NativeWind which files contain className usage
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
