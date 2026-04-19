import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/database/prisma.service';
import { ProductionController } from './presentation/controllers/production.controller';

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
  controllers: [ProductionController],
  providers: [PrismaService, ...CommandHandlers],
  exports: [PrismaService],
})
export class ProductionModule { }