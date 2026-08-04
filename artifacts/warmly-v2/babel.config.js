module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // expo-router/babel was removed in SDK 50 — babel-preset-expo covers it.
    // reanimated/plugin must stay last.
    plugins: ["react-native-reanimated/plugin"],
  };
};
