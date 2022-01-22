class Meal {
  name: string;
  lastEatenTs: number;
  eatenCount: number;
  deferred: boolean;

  constructor(
    name: string,
    lastEatenTs: number,
    eatenCount: number,
    deferred: boolean
  ) {
    this.name = name;
    this.lastEatenTs = lastEatenTs;
    this.eatenCount = eatenCount;
    this.deferred = deferred;
  }
}

export default Meal;
