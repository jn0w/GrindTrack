// Babel configuration for Expo + NativeWind (Tailwind for RN)
module.exports = function (api) {
  api.cache(true);
  return {
    // Presets enable Expo and NativeWind transforms
    presets: ["babel-preset-expo", "nativewind/babel"],
    plugins: [],
  };
};
