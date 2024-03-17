import { Timer } from './timer';
import { delaySync } from '../index';

describe('Timer', () => {
  let timer: Timer;

  afterEach(() => timer.stop());

  describe('start', () => {
    it('should throw an error if next tick is not set', () => {
      // Arrange
      timer = new Timer();

      // Act
      const act = () => timer.start();

      // Assert
      expect(act).toThrowError('Next tick is not set');
    });

    it('should throw an error if callback is not set', () => {
      // Arrange
      timer = new Timer();
      timer.setNextTick(16); // after 16ms

      // Act
      const act = () => timer.start();

      // Assert
      expect(act).toThrowError('Callback is not set');
    });

    it('should schedule timer', async () => {
      // Arrange
      timer = new Timer();
      const callback = vitest.fn();
      timer.setCallback(callback);

      // Act
      timer.setNextTick(16); // after 16ms
      timer.start(); // Scheduled
      await delaySync(128);

      // Assert
      expect(callback).toHaveBeenCalled(); // ~8 times
    });

    it('should start timer immediately', async () => {
      // Arrange
      timer = new Timer();
      const callback = vitest.fn();
      timer.setCallback(callback);

      // Act
      timer.setNextTick(1000); // after 1s
      timer.start({ initialRun: true }); // Started
      await delaySync(16);

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('resume', () => {
    it('should resume timer', async () => {
      // Arrange
      timer = new Timer();
      timer.start = vitest.fn();

      // Act
      timer.resume();

      // Assert
      expect(timer.start).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop timer', async () => {
      // Arrange
      timer = new Timer();
      const callback = vitest.fn();
      timer.setCallback(callback);

      // Act
      timer.setNextTick(16); // after 16ms
      timer.start({ initialRun: true }); // Scheduled
      await delaySync(24);
      timer.stop(); // Stopped
      await delaySync(32);

      // Assert
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
