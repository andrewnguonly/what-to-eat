import AsyncStorageMock from "../__mocks__/@react-native-async-storage/async-storage";
import * as Controller from "../src/Controller";
import Meal from "../src/Meal";

beforeEach(() => {
  jest.clearAllMocks();
});

it("get meals", async () => {
  keys = ["burger", "pizza"];

  AsyncStorageMock.getAllKeys = jest.fn(() => {
    return Promise.resolve(["burger", "pizza"]);
  });

  AsyncStorageMock.multiGet = jest.fn((keys) => {
    return Promise.resolve([
      ["burger", '{"name":"burger","last_eaten_ts":0,"eaten_count":1}'],
      ["pizza", '{"name":"pizza","last_eaten_ts":1,"eaten_count":1}'],
    ]);
  });

  const meals = await Controller.getMeals();
  expect(AsyncStorageMock.multiGet).toBeCalledWith(keys);
  expect(meals.length).toBe(2);

  const meal0 = meals[0];
  const meal1 = meals[1];
  expect(meal0).toStrictEqual(new Meal(keys[0], 0, 1));
  expect(meal1).toStrictEqual(new Meal(keys[1], 1, 1));
});

it("get meal by name, meal found", async () => {
  const mealName = "burger";

  AsyncStorageMock.getItem = jest.fn(() => {
    return Promise.resolve(
      `{"name":"${mealName}","last_eaten_ts":0,"eaten_count":1}`
    );
  });

  const meal = await Controller.getMealByName(mealName);
  expect(meal).toStrictEqual(new Meal(mealName, 0, 1));
});

it("get meal by name, meal not found", async () => {
  const mealName = "burger";

  AsyncStorageMock.getItem = jest.fn(() => {
    return Promise.resolve(null);
  });

  const meal = await Controller.getMealByName(mealName);
  expect(meal).toBeNull();
});

it("add meal, new meal", async () => {
  const mealName = "burger";

  jest
    .spyOn(global.Date, "now")
    .mockReturnValue(new Date("1970-01-01T00:00:00.000Z").valueOf());

  // TODO: Figure out how to mock Controller.getMealByName() properly.
  // Workaround is to mock AsyncStorageMock.getItem() directly.
  //
  // jest
  //   .spyOn(Controller, "getMealByName")
  //   .mockImplementation(() => Promise.resolve(null));
  AsyncStorageMock.getItem = jest.fn(() => {
    return Promise.resolve(null);
  });

  const mealJson = `{"name":"${mealName}","last_eaten_ts":0,"eaten_count":1}`;

  await Controller.addMeal(mealName);
  expect(AsyncStorageMock.setItem).toBeCalledWith(mealName, mealJson);
});

it("add meal, existing meal", async () => {
  const mealName = "burger";

  jest
    .spyOn(global.Date, "now")
    .mockReturnValue(new Date("1970-01-01T00:00:00.000Z").valueOf());

  // TODO: Figure out how to mock Controller.getMealByName() properly.
  // Workaround is to mock AsyncStorageMock.getItem() directly.
  //
  // jest
  //   .spyOn(Controller, "getMealByName")
  //   .mockImplementation(() => Promise.resolve(new Meal(mealName, 0, 5)));
  AsyncStorageMock.getItem = jest.fn(() => {
    return Promise.resolve(
      `{"name":"${mealName}","last_eaten_ts":0,"eaten_count":5}`
    );
  });

  const mealJson = `{"name":"${mealName}","last_eaten_ts":0,"eaten_count":6}`;

  await Controller.addMeal(mealName);
  expect(AsyncStorageMock.setItem).toBeCalledWith(mealName, mealJson);
});

it("delete meals", async () => {
  await Controller.deleteMeals();
  expect(AsyncStorageMock.clear).toBeCalled();
});

it("delete meal by name", async () => {
  const mealName = "burger";
  await Controller.deleteMealByName(mealName);
  expect(AsyncStorageMock.removeItem).toBeCalledWith(mealName);
});
