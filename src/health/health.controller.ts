import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { version } from '/package.json';
import ms from 'ms';

@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  private readonly startedAt = Date.now();

  @Get()
  @ApiTags('Health')
  async getHealth() {
    return {
      service: 'alive',
      uptime: this.getUptime(),
      version,
    };
  }

  private getUptime() {
    const now = Date.now();

    return ms(now - this.startedAt);
  }
}
