import { CreateOrderDto, UpdateOrderStatusDto } from '../dtos/orders.dtos';

export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly data: CreateOrderDto,
  ) {}
}

export class UpdateOrderStatusCommand {
  constructor(
    public readonly orderId: string,
    public readonly data: UpdateOrderStatusDto,
  ) {}
}
