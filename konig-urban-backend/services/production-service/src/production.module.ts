import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/prisma.service';
import { ProductionController } from './presentation/production.controller';
import { HealthController } from './presentation/health.controller';
import {
  CreatePurchaseOrderHandler,
  CreateQualityCheckHandler,
  CreateSupplierHandler,
  UpdatePurchaseOrderHandler,
} from './application/commands/production.handlers';

const CommandHandlers = [
  CreateSupplierHandler,
  CreatePurchaseOrderHandler,
  UpdatePurchaseOrderHandler,
  CreateQualityCheckHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProductionController, HealthController],
  providers: [PrismaService, ...CommandHandlers],
  exports: [PrismaService],
})
export class ProductionModule {}