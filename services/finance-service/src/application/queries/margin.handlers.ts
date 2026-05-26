import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMarginsQuery } from './margin.queries';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(GetMarginsQuery)
export class GetMarginsHandler implements IQueryHandler<GetMarginsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetMarginsQuery) {
    const whereClause = query.prendaId ? { prendaId: query.prendaId } : {};

    return this.prisma.margenProducto.findMany({
      where: whereClause,
      orderBy: { fechaCalculo: 'desc' },
    });
  }
}
