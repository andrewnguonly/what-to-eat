import AsyncStorageMock from "../__mocks__/@react-native-async-storage/async-storage";
import { getMeals } from "../src/Controller";
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
