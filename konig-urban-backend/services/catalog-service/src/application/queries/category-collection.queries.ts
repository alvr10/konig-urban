import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export class GetCategoriesQuery {}

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.categoria.findMany();
  }
}

export class GetCollectionsQuery {}

@QueryHandler(GetCollectionsQuery)
export class GetCollectionsHandler implements IQueryHandler<GetCollectionsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.coleccion.findMany();
  }
}
