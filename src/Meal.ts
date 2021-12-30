class Meal {
  name: string;
  lastEatenTs: number;
  eatenCount: number;

  constructor(name: string, lastEatenTs: number, eatenCount: number) {
    this.name = name;
    this.lastEatenTs = lastEatenTs;
    this.eatenCount = eatenCount;
  }
}

export default Meal;
