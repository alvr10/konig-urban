import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export class GetProductsQuery {
  constructor(
    public readonly filters: {
      categoryId?: string;
      collectionId?: string;
      search?: string;
      active?: boolean;
    }
  ) {}
}

export class GetProductDetailQuery {
  constructor(public readonly productId: string) {}
}

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetProductsQuery) {
    const { filters } = query;
    return this.prisma.prenda.findMany({
      where: {
        ...(filters.categoryId && { categoriaId: filters.categoryId }),
        ...(filters.collectionId && { coleccionId: filters.collectionId }),
        ...(filters.active !== undefined && { activo: filters.active }),
        ...(filters.search && {
          OR: [
            { nombre: { contains: filters.search, mode: 'insensitive' } },
            { descripcion: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
    });
  }
}

@QueryHandler(GetProductDetailQuery)
export class GetProductDetailHandler implements IQueryHandler<GetProductDetailQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetProductDetailQuery) {
    return this.prisma.prenda.findUnique({
      where: { id: query.productId },
    });
  }
}
