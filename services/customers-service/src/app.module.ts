import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@konig/shared';
import { CustomersModule } from './customer.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'customers-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryClientModule,
    MetricsModule,
    CustomersModule
  ],
  controllers: [HealthController],
})
export class AppModule { }

