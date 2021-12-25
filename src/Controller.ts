import AsyncStorage from "@react-native-async-storage/async-storage";
import Meal from "./Meal";

export const getMeals = async () => {
  let keys: string[] = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    // read key error
  }
  console.log(`Got keys: ${keys}`);

  let pairs: [string, string | null][] = [];
  try {
    pairs = await AsyncStorage.multiGet(keys);
  } catch (e) {
    // read error
  }
  console.log(`Got pairs: ${pairs}`);

  const values = pairs.map((pair) => pair[1]);
  console.log(`Got values: ${values}`);

  return values.map((value) => {
    if (value != null) {
      const obj = JSON.parse(value);
      return new Meal(obj["name"], obj["last_eaten_ts"], obj["eaten_count"]);
    } else {
      return new Meal("null", 0, 0);
    }
  });
};

export const getMealByName = async (name: string) => {
  try {
    const value = await AsyncStorage.getItem(name);
    if (value !== null) {
      const obj = JSON.parse(value);
      return new Meal(obj["name"], obj["last_eaten_ts"], obj["eaten_count"]);
    } else {
      return null;
    }
  } catch (e) {
    // error reading value
  }
};

export const addMeal = async (name: string) => {
  let eaten_count = 1;
  const meal = await getMealByName(name);

  if (meal != null) {
    console.log("Existing meal found.");
    eaten_count += meal.eaten_count;
  }

  try {
    const jsonValue = JSON.stringify(new Meal(name, Date.now(), eaten_count));
    await AsyncStorage.setItem(name, jsonValue);
  } catch (e) {
    // save error
  }
};

export const deleteMeals = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
  console.log("Deleted all meals.");
};

export const deleteMealByName = async (name: string) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (e) {
    // remove error
  }

  console.log(`Deleted meal: ${name}.`);
};
