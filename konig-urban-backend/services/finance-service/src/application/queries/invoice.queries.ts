import { InvoiceStatus } from '../dtos/finance.dtos';

export class GetUserInvoicesQuery {
  constructor(public readonly userId: string) {}
}

export class GetInvoiceDetailQuery {
  constructor(
    public readonly userId: string,
    public readonly invoiceId: string,
  ) {}
}

export class GetAdminInvoicesQuery {
  constructor(
    public readonly filters: {
      startDate?: string;
      endDate?: string;
      status?: InvoiceStatus;
    },
  ) {}
}
