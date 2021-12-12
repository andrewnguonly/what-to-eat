class Meal {
  name: string;
  last_eaten_ts: number;
  eaten_count: number;

  constructor(name, last_eaten_ts, eaten_count) {
    this.name = name;
    this.last_eaten_ts = last_eaten_ts;
    this.eaten_count = eaten_count;
  }
}

export default Meal;
