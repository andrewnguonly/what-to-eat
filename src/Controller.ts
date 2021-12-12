import Meal from "./Meal";

function getMeals(): Meal[] {
  const meal1 = new Meal();
  meal1.name = "hamburger";

  const meal2 = new Meal();
  meal2.name = "pizza";

  return new Array(meal1, meal2);
}

export default getMeals;
