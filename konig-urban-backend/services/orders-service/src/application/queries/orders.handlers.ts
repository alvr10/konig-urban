import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetAdminOrdersQuery,
  GetOrderDetailQuery,
  GetShipmentTrackingQuery,
  GetShopperOrdersQuery,
} from './orders.queries';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

@QueryHandler(GetShopperOrdersQuery)
export class GetShopperOrdersHandler implements IQueryHandler<GetShopperOrdersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetShopperOrdersQuery) {
    return this.prisma.pedido.findMany({
      where: { clienteId: query.userId },
      orderBy: { fecha: 'desc' },
    });
  }
}

@QueryHandler(GetOrderDetailQuery)
export class GetOrderDetailHandler implements IQueryHandler<GetOrderDetailQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetOrderDetailQuery) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id: query.orderId },
      include: {
        lineas: true,
        envio: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException('Order not found');
    }

    if (query.userId && pedido.clienteId !== query.userId) {
      throw new UnauthorizedException('Order does not belong to you');
    }

    return pedido;
  }
}

@QueryHandler(GetShipmentTrackingQuery)
export class GetShipmentTrackingHandler implements IQueryHandler<GetShipmentTrackingQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetShipmentTrackingQuery) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id: query.orderId },
      include: { envio: true },
    });

    if (!pedido || !pedido.envio) {
      throw new NotFoundException('Shipment data not available for this order');
    }

    return pedido.envio;
  }
}

@QueryHandler(GetAdminOrdersQuery)
export class GetAdminOrdersHandler implements IQueryHandler<GetAdminOrdersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAdminOrdersQuery) {
    const where: any = {};
    if (query.filters.status) {
      where.estado = query.filters.status;
    }

    return this.prisma.pedido.findMany({
      where,
      orderBy: { fecha: 'desc' },
    });
  }
}
