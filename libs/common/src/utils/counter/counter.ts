export class Counter {
  private count: number;

  constructor(start?: number) {
    this.count = start || 0;
  }

  increment() {
    return ++this.count;
  }

  decrement() {
    return --this.count;
  }

  reset() {
    return (this.count = 0);
  }

  value() {
    return this.count;
  }

  isPositive() {
    return this.count > 0;
  }

  isNegative() {
    return this.count < 0;
  }

  isZero() {
    return this.count === 0;
  }
}
