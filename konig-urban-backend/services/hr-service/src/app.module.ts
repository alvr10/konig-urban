import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@konig/shared';

// TODO: Add content logic here
// Suggested modules:
//   - ContentPiecesModule (Kanban/Calendar CRUD, status transitions via Mongoose)

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
    MetricsModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
