import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@konig/core-backend';
import { FinanceModule } from './finance.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'finance-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryClientModule,
    MetricsModule,
    FinanceModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
