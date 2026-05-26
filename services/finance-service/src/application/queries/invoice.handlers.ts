import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import {
  GetAdminInvoicesQuery,
  GetInvoiceDetailQuery,
  GetUserInvoicesQuery,
} from './invoice.queries';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(GetUserInvoicesQuery)
export class GetUserInvoicesHandler implements IQueryHandler<GetUserInvoicesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUserInvoicesQuery) {
    return this.prisma.factura.findMany({
      where: { clienteId: query.userId },
      orderBy: { fechaEmision: 'desc' },
    });
  }
}

@QueryHandler(GetInvoiceDetailQuery)
export class GetInvoiceDetailHandler implements IQueryHandler<GetInvoiceDetailQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetInvoiceDetailQuery) {
    const invoice = await this.prisma.factura.findFirst({
      where: {
        id: query.invoiceId,
        clienteId: query.userId,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Since we omit orderSnapshot per discussion in MVP, we just return the invoice directly.
    // If order Snapshot exists in the future via external call, it would be appended here.
    return invoice;
  }
}

@QueryHandler(GetAdminInvoicesQuery)
export class GetAdminInvoicesHandler implements IQueryHandler<GetAdminInvoicesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAdminInvoicesQuery) {
    const { startDate, endDate, status } = query.filters;

    const whereClause: any = {};

    if (status) {
      whereClause.estado = status;
    }

    if (startDate || endDate) {
      whereClause.fechaEmision = {};
      if (startDate) {
        whereClause.fechaEmision.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.fechaEmision.lte = new Date(endDate);
      }
    }

    return this.prisma.factura.findMany({
      where: whereClause,
      orderBy: { fechaEmision: 'desc' },
    });
  }
}
