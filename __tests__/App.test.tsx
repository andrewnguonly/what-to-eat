import "react-native";
import React from "react";
import App from "../src/App";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";
import TestRenderer from "react-test-renderer";

const { act } = TestRenderer;

// This mock is needed. Otherwise, the test suite will not run.
jest.mock("@react-native-community/push-notification-ios", () => ({}));

it("renders correctly", async () => {
  await act(async () => {
    renderer.create(<App />);
  });
});
