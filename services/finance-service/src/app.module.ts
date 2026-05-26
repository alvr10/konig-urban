import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@konig/shared';
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
    FinanceModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
