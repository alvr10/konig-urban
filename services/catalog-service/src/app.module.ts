import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@konig/shared';
import { CatalogModule } from './catalog.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'catalog-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryClientModule,
    MetricsModule,
    CatalogModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
