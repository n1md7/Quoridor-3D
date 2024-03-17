import { ConfigModule } from '/common/configuration/config.module';
import { HealthModule } from '/src/health/health.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [HealthModule, ConfigModule],
  providers: [],
})
export class AppModule {}
