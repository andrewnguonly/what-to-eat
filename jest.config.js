module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {},
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|react-native-dialog|@fortawesome|react-native-push-notification|@react-native-community)/)",
  ],
  setupFiles: ["./node_modules/react-native-gesture-handler/jestSetup.js"],
};
