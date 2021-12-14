import Meal from "./Meal";

function getMeals(): Meal[] {
  const meal1 = new Meal();
  meal1.name = "hamburger";
  meal1.last_eaten_ts = 0;

  const meal2 = new Meal();
  meal2.name = "pizza";
  meal2.last_eaten_ts = 2;

  const meal3 = new Meal();
  meal3.name = "tacos";
  meal3.last_eaten_ts = 1;

  return new Array(meal1, meal2, meal3);
}

export default getMeals;
