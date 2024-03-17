import { Counter } from './counter';

describe('Counter', () => {
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter();
  });

  it('should initialize with count zero', () => {
    expect(counter.value()).toBe(0);
  });

  it('should increment count by 1', () => {
    counter.increment();
    expect(counter.value()).toBe(1);
  });

  it('should decrement count by 1', () => {
    counter.decrement();
    expect(counter.value()).toBe(-1);
  });

  it('should reset count to zero', () => {
    counter.increment();
    counter.reset();
    expect(counter.value()).toBe(0);
  });

  it('should return true for isPositive if count is positive', () => {
    counter.increment();
    expect(counter.isPositive()).toBe(true);
  });

  it('should return false for isPositive if count is not positive', () => {
    counter.reset();
    expect(counter.isPositive()).toBe(false);
  });

  it('should return true for isNegative if count is negative', () => {
    counter.decrement();
    expect(counter.isNegative()).toBe(true);
  });

  it('should return false for isNegative if count is not negative', () => {
    counter.reset();
    expect(counter.isNegative()).toBe(false);
  });

  it('should return true for isZero if count is zero', () => {
    expect(counter.isZero()).toBe(true);
  });

  it('should return false for isZero if count is not zero', () => {
    counter.increment();
    expect(counter.isZero()).toBe(false);
  });
});
