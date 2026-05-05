import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@konig/shared';
import { HrModule } from './hr.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'hr-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryClientModule,
    MetricsModule,
    HrModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
