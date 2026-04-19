import {
  CreatePurchaseOrderDto,
  CreateQualityCheckDto,
  CreateSupplierDto,
  UpdatePurchaseOrderDto,
} from '../dtos/production.dto';

export class CreateSupplierCommand {
  constructor(public readonly payload: CreateSupplierDto) {}
}

export class CreatePurchaseOrderCommand {
  constructor(public readonly payload: CreatePurchaseOrderDto) {}
}

export class UpdatePurchaseOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly payload: UpdatePurchaseOrderDto,
  ) {}
}

export class CreateQualityCheckCommand {
  constructor(public readonly payload: CreateQualityCheckDto) {}
}