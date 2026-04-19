import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@konig/shared';
import { ProductionModule } from './production.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'production-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryClientModule,
    MetricsModule,
    ProductionModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
