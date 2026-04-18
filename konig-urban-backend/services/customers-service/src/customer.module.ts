import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/prisma.service';
import { CustomersController } from './presentation/customers.controller';
import { HealthController } from './presentation/health.controller';
import {
  UpdateCustomerByCrmHandler,
  UpdateMeHandler,
} from './application/commands/customer.handlers';

const CommandHandlers = [UpdateMeHandler, UpdateCustomerByCrmHandler];

@Module({
  imports: [CqrsModule],
  controllers: [CustomersController, HealthController],
  providers: [PrismaService, ...CommandHandlers],
  exports: [PrismaService],
})
export class CustomersModule {}