import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AdminOrderFilterDto, UpdateOrderStatusDto } from '../../application/dtos/orders.dtos';
import { GetAdminOrdersQuery } from '../../application/queries/orders.queries';
import { UpdateOrderStatusCommand } from '../../application/commands/orders.commands';

@Controller('erm/orders')
export class ErmOrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAdminOrders(@Query() filters: AdminOrderFilterDto) {
    return this.queryBus.execute(new GetAdminOrdersQuery(filters));
  }

  @Patch(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.commandBus.execute(new UpdateOrderStatusCommand(orderId, dto));
  }
}
