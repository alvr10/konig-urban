import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/database/prisma.service';
import { ShopperOrderController } from './presentation/controllers/shopper.controller';
import { ShipmentController } from './presentation/controllers/shipments.controller';
import { ErmOrderController } from './presentation/controllers/erm.controller';
import { CreateOrderHandler, UpdateOrderStatusHandler } from './application/commands/orders.handlers';
import {
  GetAdminOrdersHandler,
  GetOrderDetailHandler,
  GetShipmentTrackingHandler,
  GetShopperOrdersHandler,
} from './application/queries/orders.handlers';

const CommandHandlers = [CreateOrderHandler, UpdateOrderStatusHandler];
const QueryHandlers = [
  GetAdminOrdersHandler,
  GetOrderDetailHandler,
  GetShipmentTrackingHandler,
  GetShopperOrdersHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ShopperOrderController, ShipmentController, ErmOrderController],
  providers: [PrismaService, ...CommandHandlers, ...QueryHandlers],
})
export class OrdersModule {}
