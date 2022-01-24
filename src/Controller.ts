import AsyncStorage from "@react-native-async-storage/async-storage";
import Meal from "./Meal";

export const getMeals = async (query?: string) => {
  let keys: string[] = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    // read key error
  }
  console.log(`Got keys: ${keys}`);

  console.log(`Got query: ${query}`);
  if (query != null && query.length > 0) {
    keys = keys.filter((key) => key.toLowerCase().includes(query));
    console.log(`Got filtered keys: ${keys}`);
  }

  let pairs: [string, string | null][] = [];
  try {
    pairs = await AsyncStorage.multiGet(keys);
  } catch (e) {
    // read error
  }

  const values = pairs.map((pair) => pair[1]);
  console.log(`Got values: ${values}`);

  return values
    .map((value) => {
      if (value != null) {
        const obj = JSON.parse(value);
        return new Meal(
          obj["name"],
          obj["lastEatenTs"],
          obj["eatenCount"],
          obj["deferred"] || false
        );
      } else {
        return new Meal("null", 0, 0, false);
      }
    })
    .sort((meal1, meal2) => {
      // Sort meals in ascending order by lastEatenTs.
      // Older meals appear first.
      return meal1.lastEatenTs - meal2.lastEatenTs;
    });
};

export const getMealByName = async (name: string) => {
  try {
    const value = await AsyncStorage.getItem(name);
    if (value !== null) {
      const obj = JSON.parse(value);
      return new Meal(
        obj["name"],
        obj["lastEatenTs"],
        obj["eatenCount"],
        obj["deferred"] || false
      );
    } else {
      return null;
    }
  } catch (e) {
    // error reading value
  }
};

export const addMeal = async (name: string) => {
  let eatenCount = 1;
  const meal = await getMealByName(name);

  if (meal != null) {
    console.log("Existing meal found.");
    eatenCount += meal.eatenCount;
  }

  try {
    const jsonValue = JSON.stringify(
      new Meal(name, Date.now(), eatenCount, false)
    );
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

export const editMealName = async (name: string, newName: string) => {
  try {
    const meal = await getMealByName(name);
    if (meal != null) {
      // replace meal name
      meal.name = newName;
      // add new key
      const jsonValue = JSON.stringify(meal);
      await AsyncStorage.setItem(newName, jsonValue);
      // delete old key
      await deleteMealByName(name);
    }
  } catch (e) {
    // do nothing
  }
};

export const deferMealByName = async (name: string) => {
  try {
    const meal = await getMealByName(name);
    if (meal != null) {
      meal.deferred = true;
      meal.lastEatenTs = Date.now();
      const jsonValue = JSON.stringify(meal);
      await AsyncStorage.setItem(name, jsonValue);
    }
  } catch (e) {
    // do nothing
  }
};
