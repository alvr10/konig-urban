import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetShipmentTrackingQuery } from '../../application/queries/orders.queries';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':orderId')
  async trackShipment(@Param('orderId') orderId: string) {
    return this.queryBus.execute(new GetShipmentTrackingQuery(orderId));
  }
}
