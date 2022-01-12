import { formatEatenCount, formatTs } from "../../src/components/MealListItem";

it("formats timestamp correctly", () => {
  // mock date to December 25, 2021 12:00:00 AM
  jest.useFakeTimers("modern");
  jest.setSystemTime(new Date(1640390400000));

  const ts1 = 1640390400000; // December 25, 2021 12:00:00 AM
  const ts2 = 1640390399000; // December 24, 2021 11:59:59 PM
  const ts3 = 1640304000000; // December 24, 2021 12:00:00 AM
  const ts4 = 1639872000000; // December 19, 2021 12:00:00 AM
  const ts5 = 1639871999000; // December 18, 2021 11:59:59 PM
  const ts6 = 1639785600000; // December 18, 2021 12:00:00 AM
  const ts7 = 1638057600000; // November 28, 2021 12:00:00 AM
  const ts8 = 1638057599000; // November 27, 2021 11:59:59 PM
  const ts9 = 1637971200000; // November 27, 2021 12:00:00 AM
  const ts10 = 1635552000000; // October 30, 2021 12:00:00 AM

  expect(formatTs(ts1)).toBe("today");
  expect(formatTs(ts2)).toBe("1d");
  expect(formatTs(ts3)).toBe("1d");
  expect(formatTs(ts4)).toBe("6d");
  expect(formatTs(ts5)).toBe("1w");
  expect(formatTs(ts6)).toBe("1w");
  expect(formatTs(ts7)).toBe("3w");
  expect(formatTs(ts8)).toBe("1mo");
  expect(formatTs(ts9)).toBe("1mo");
  expect(formatTs(ts10)).toBe("2mo");

  jest.useRealTimers();
});

it("formats eaten count correctly", () => {
  expect(formatEatenCount(1)).toBe("");
  expect(formatEatenCount(2)).toBe(" (2)");
});
