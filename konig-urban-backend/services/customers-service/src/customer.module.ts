import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/database/prisma.service';
import { CustomersController } from './presentation/controllers/customer.controller';
import {
  UpdateCustomerByCrmHandler,
  UpdateMeHandler,
} from './application/commands/customer.handlers';

const CommandHandlers = [UpdateMeHandler, UpdateCustomerByCrmHandler];

@Module({
  imports: [CqrsModule],
  controllers: [CustomersController],
  providers: [PrismaService, ...CommandHandlers],
  exports: [PrismaService],
})
export class CustomersModule {}