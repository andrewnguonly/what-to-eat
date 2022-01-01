module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {},
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|react-native-dialog)/)",
  ],
  setupFiles: ["./node_modules/react-native-gesture-handler/jestSetup.js"],
};
