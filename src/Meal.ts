class Meal {
  name: string;
  last_eaten_ts: number;
  eaten_count: number;

  constructor(name: string, last_eaten_ts: number, eaten_count: number) {
    this.name = name;
    this.last_eaten_ts = last_eaten_ts;
    this.eaten_count = eaten_count;
  }
}

export default Meal;
