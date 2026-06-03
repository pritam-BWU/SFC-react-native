module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-vector-icons|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-linear-gradient)/)',
  ],
};
