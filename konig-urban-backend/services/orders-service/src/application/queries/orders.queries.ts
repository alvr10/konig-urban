import { AdminOrderFilterDto } from '../dtos/orders.dtos';

export class GetShopperOrdersQuery {
  constructor(public readonly userId: string) {}
}

export class GetOrderDetailQuery {
  constructor(
    public readonly orderId: string,
    public readonly userId?: string, // Used to verify ownership if called by shopper
  ) {}
}

export class GetShipmentTrackingQuery {
  constructor(public readonly orderId: string) {}
}

export class GetAdminOrdersQuery {
  constructor(public readonly filters: AdminOrderFilterDto) {}
}
