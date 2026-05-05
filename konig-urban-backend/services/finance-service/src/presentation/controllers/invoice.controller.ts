import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetAdminInvoicesQuery,
  GetInvoiceDetailQuery,
  GetUserInvoicesQuery,
} from '../../application/queries/invoice.queries';
import { AdminInvoicesFilterDto } from '../../application/dtos/finance.dtos';

@Controller()
export class InvoiceController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('invoices')
  async getUserInvoices(@Headers('x-user-id') userId: string) {
    // In production, x-user-id is injected by the API Gateway
    return this.queryBus.execute(new GetUserInvoicesQuery(userId));
  }

  @Get('invoices/:invoiceId')
  async getInvoiceDetail(
    @Headers('x-user-id') userId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.queryBus.execute(new GetInvoiceDetailQuery(userId, invoiceId));
  }

  @Get('admin/invoices')
  async getAdminInvoices(@Query() filters: AdminInvoicesFilterDto) {
    // Requires admin privilege validation on API Gateway level
    return this.queryBus.execute(new GetAdminInvoicesQuery(filters));
  }
}
