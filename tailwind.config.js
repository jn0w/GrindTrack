/** @type {import('tailwindcss').Config} */
// Tailwind/NativeWind config: tells the compiler where to look for classNames
module.exports = {
  // Scan the root App and all source files for className usage
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
