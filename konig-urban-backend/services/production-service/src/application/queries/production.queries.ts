import {
  PurchaseOrderFilterDto,
  SupplierFilterDto,
} from '../dtos/production.dto';

export class GetSuppliersQuery {
  constructor(public readonly filters: SupplierFilterDto) {}
}

export class GetPurchaseOrdersQuery {
  constructor(public readonly filters: PurchaseOrderFilterDto) {}
}

export class GetQualityChecksQuery {}