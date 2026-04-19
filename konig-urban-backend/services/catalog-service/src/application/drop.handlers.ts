import { CommandHandler, ICommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../infrastructure/database/prisma.service';

export class GetDropsQuery {}

@QueryHandler(GetDropsQuery)
export class GetDropsHandler implements IQueryHandler<GetDropsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.drop.findMany({
      where: {
        OR: [
          { activo: true },
          { fechaInicio: { gt: new Date() } }
        ]
      }
    });
  }
}

export class ScheduleDropCommand {
  constructor(
    public readonly data: {
      coleccionId: string;
      fechaInicio: string;
      fechaFin: string;
      activo?: boolean;
      descripcion?: string;
    }
  ) {}
}

@CommandHandler(ScheduleDropCommand)
export class ScheduleDropHandler implements ICommandHandler<ScheduleDropCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: ScheduleDropCommand) {
    const { data } = command;
    return this.prisma.drop.create({
      data: {
        coleccionId: data.coleccionId,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: new Date(data.fechaFin),
        activo: data.activo ?? false,
        descripcion: data.descripcion,
      },
    });
  }
}
