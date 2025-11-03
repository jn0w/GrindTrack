// Babel configuration: tells Metro/Expo how to transpile the code
module.exports = function (api) {
  // Cache the computed config for faster rebuilds
  api.cache(true);
  return {
    // Expo preset for React Native + NativeWind for Tailwind-in-RN className support
    presets: ["babel-preset-expo", "nativewind/babel"],
    plugins: [],
  };
};
