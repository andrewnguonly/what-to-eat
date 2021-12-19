import AsyncStorageMock from "../__mocks__/@react-native-async-storage/async-storage";
import {
  addMeal,
  deleteMealByName,
  deleteMeals,
  getMealByName,
  getMeals,
} from "../src/Controller";
import Meal from "../src/Meal";

it("get meals", async () => {
  keys = ["burger", "pizza"];

  const meals = await getMeals();
  expect(AsyncStorageMock.multiGet).toBeCalledWith(keys);
  expect(meals.length).toBe(2);

  const meal0 = meals[0];
  const meal1 = meals[1];
  expect(meal0).toStrictEqual(new Meal(keys[0], 0, 1));
  expect(meal1).toStrictEqual(new Meal(keys[1], 1, 1));
});

it("get meal by name", async () => {});

// it("add meal", async () => {
//   jest
//     .spyOn(global.Date, "now")
//     .mockImplementationOnce(() =>
//       new Date('1970-01-01T00:00:00.000Z').valueOf()
//     );

//   const mealName = "burger";
//   const mealJson = `{"name":"${mealName}","last_eaten_ts":0,"eaten_count":1}`;

//   await addMeal(mealName);
//   expect(AsyncStorageMock.setItem).toBeCalledWith(mealName, mealJson);
// });

it("delete meals", async () => {
  await deleteMeals();
  expect(AsyncStorageMock.clear).toBeCalled();
});

it("delete meal by name", async () => {
  const mealName = "burger";
  await deleteMealByName(mealName);
  expect(AsyncStorageMock.removeItem).toBeCalledWith(mealName);
});
