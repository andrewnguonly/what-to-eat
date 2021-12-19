import AsyncStorage from "@react-native-async-storage/async-storage";
import Meal from "./Meal";

export const getMeals = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    // read key error
  }
  console.log(`Got keys: ${keys}`);

  let pairs = [];
  try {
    pairs = await AsyncStorage.multiGet(keys);
  } catch (e) {
    // read error
  }
  console.log(`Got pairs: ${pairs}`);

  let values = pairs.map((pair) => pair[1]);
  console.log(`Got values: ${values}`);

  return values.map((value) => {
    obj = JSON.parse(value);
    return new Meal(obj["name"], obj["last_eaten_ts"], obj["eaten_count"]);
  });
};

export const getMealByName = async (name) => {
  try {
    const value = await AsyncStorage.getItem(name);
    if (value !== null) {
      obj = JSON.parse(value);
      return new Meal(obj["name"], obj["last_eaten_ts"], obj["eaten_count"]);
    } else {
      return null;
    }
  } catch (e) {
    // error reading value
  }
};

export const addMeal = async (name) => {
  let eaten_count = 1;
  const mealObj = getMealByName(name);

  if (mealObj) {
    eaten_count += mealObj["eaten_count"];
  }

  const meal = new Meal(name, Date.now(), eaten_count);

  try {
    const jsonValue = JSON.stringify(meal);
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

export const deleteMealByName = async (name) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (e) {
    // remove error
  }

  console.log(`Deleted meal: ${name}.`);
};
