import "react-native";
import React from "react";
import App from "../src/App";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";
import TestRenderer from "react-test-renderer";

const { act } = TestRenderer;

it("renders correctly", async () => {
  await act(async () => {
    renderer.create(<App />);
  });
});

it("formats timestamp correctly", () => {
  // mock date to December 25, 2021 12:00:00 AM
  jest.spyOn(global, "Date").mockReturnValue(new Date(1640390400000));

  ts1 = 1640304000000; // December 24, 2021 12:00:00 AM

  expect(App.formatTs(ts1)).toBe("today");
});
