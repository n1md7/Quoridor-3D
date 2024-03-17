import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return defined value', () => {
    expect(controller.getHealth()).resolves.toEqual(
      expect.objectContaining({
        service: 'alive',
        uptime: expect.any(String),
        version: expect.any(String),
      }),
    );
  });
});
