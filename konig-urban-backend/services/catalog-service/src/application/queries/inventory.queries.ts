import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export class GetInventoryUidsQuery {
  constructor(
    public readonly filters: {
      productId?: string;
      status?: string;
    }
  ) {}
}

@QueryHandler(GetInventoryUidsQuery)
export class GetInventoryUidsHandler implements IQueryHandler<GetInventoryUidsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetInventoryUidsQuery) {
    const { filters } = query;
    return this.prisma.identificadorUnico.findMany({
      where: {
        ...(filters.productId && { prendaId: filters.productId }),
        ...(filters.status && { estado: filters.status }),
      },
    });
  }
}
