import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@konig/shared';
import { OrdersModule } from './orders.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'orders-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryClientModule,
    MetricsModule,
    OrdersModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
