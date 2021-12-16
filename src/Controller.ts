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

export const addMeal = async (name) => {
  const meal = new Meal(name, Date.now(), 1);
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
