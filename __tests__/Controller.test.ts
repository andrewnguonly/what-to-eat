import AsyncStorageMock from "../__mocks__/@react-native-async-storage/async-storage";
import * as Controller from "../src/Controller";
import Meal from "../src/Meal";

beforeEach(() => {
  jest.clearAllMocks();
});

it("get meals", async () => {
  const keys = ["burger", "pizza", "salad"];

  AsyncStorageMock.getAllKeys = jest.fn(() => {
    return Promise.resolve(["burger", "pizza", "salad"]);
  });

  AsyncStorageMock.multiGet = jest.fn(() => {
    return Promise.resolve([
      ["burger", '{"name":"burger","lastEatenTs":1,"eatenCount":1}'],
      ["pizza", '{"name":"pizza","lastEatenTs":0,"eatenCount":1}'],
      ["salad", '{"name":"salad","lastEatenTs":2,"eatenCount":1}'],
    ]);
  });

  const meals = await Controller.getMeals();
  expect(AsyncStorageMock.multiGet).toBeCalledWith(keys);
  expect(meals.length).toBe(3);

  const meal0 = meals[0];
  const meal1 = meals[1];
  const meal2 = meals[2];
  expect(meal0).toStrictEqual(new Meal(keys[1], 0, 1, false));
  expect(meal1).toStrictEqual(new Meal(keys[0], 1, 1, false));
  expect(meal2).toStrictEqual(new Meal(keys[2], 2, 1, false));
});

it("get meals with query", async () => {
  const keys = ["burger", "pizza", "salad"];
  const filteredKeys = ["pizza"];

  AsyncStorageMock.getAllKeys = jest.fn(() => {
    return Promise.resolve(["burger", "pizza", "salad"]);
  });

  AsyncStorageMock.multiGet = jest.fn(() => {
    return Promise.resolve([
      ["pizza", '{"name":"pizza","lastEatenTs":0,"eatenCount":1}'],
    ]);
  });

  const meals = await Controller.getMeals("zz");
  expect(AsyncStorageMock.multiGet).toBeCalledWith(filteredKeys);
  expect(meals.length).toBe(1);

  const meal0 = meals[0];
  expect(meal0).toStrictEqual(new Meal(keys[1], 0, 1, false));
});

it("get meal by name, meal found", async () => {
  const mealName = "burger";

  AsyncStorageMock.getItem = jest.fn(() => {
    return Promise.resolve(
      `{"name":"${mealName}","lastEatenTs":0,"eatenCount":1}`
    );
  });

  const meal = await Controller.getMealByName(mealName);
  expect(meal).toStrictEqual(new Meal(mealName, 0, 1, false));
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

  const mealJson = `{"name":"${mealName}","lastEatenTs":0,"eatenCount":1,"deferred":false}`;

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
      `{"name":"${mealName}","lastEatenTs":0,"eatenCount":5}`
    );
  });

  const mealJson = `{"name":"${mealName}","lastEatenTs":0,"eatenCount":6,"deferred":false}`;

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

it("edit meal name", async () => {
  const mealName = "pizza";
  const newMealName = "veggie pizza";

  AsyncStorageMock.getItem = jest.fn(() => {
    return Promise.resolve(
      `{"name":"${mealName}","lastEatenTs":0,"eatenCount":5}`
    );
  });

  await Controller.editMealName(mealName, newMealName);

  expect(AsyncStorageMock.setItem).toBeCalledWith(
    newMealName,
    `{"name":"${newMealName}","lastEatenTs":0,"eatenCount":5,"deferred":false}`
  );
  expect(AsyncStorageMock.removeItem).toBeCalledWith(mealName);
});

it("defer meal", async () => {
  const mealName = "pizza";

  jest
    .spyOn(global.Date, "now")
    .mockReturnValue(new Date("1970-01-01T00:00:01.000Z").valueOf());

  AsyncStorageMock.getItem = jest.fn(() => {
    return Promise.resolve(
      `{"name":"${mealName}","lastEatenTs":0,"eatenCount":5,"deferred":false}`
    );
  });

  await Controller.deferMealByName(mealName);

  expect(AsyncStorageMock.setItem).toBeCalledWith(
    mealName,
    `{"name":"${mealName}","lastEatenTs":1000,"eatenCount":5,"deferred":true}`
  );
});
