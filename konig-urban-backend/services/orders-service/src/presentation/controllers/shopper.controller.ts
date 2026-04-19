import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from '../../application/dtos/orders.dtos';
import { CreateOrderCommand } from '../../application/commands/orders.commands';
import { GetOrderDetailQuery, GetShopperOrdersQuery } from '../../application/queries/orders.queries';

@Controller()
export class ShopperOrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createOrder(@Headers('x-user-id') userId: string, @Body() dto: CreateOrderDto) {
    return this.commandBus.execute(new CreateOrderCommand(userId, dto));
  }

  @Get()
  async getMyOrders(@Headers('x-user-id') userId: string) {
    return this.queryBus.execute(new GetShopperOrdersQuery(userId));
  }

  @Get(':orderId')
  async getOrderDetail(@Headers('x-user-id') userId: string, @Param('orderId') orderId: string) {
    return this.queryBus.execute(new GetOrderDetailQuery(orderId, userId));
  }
}
