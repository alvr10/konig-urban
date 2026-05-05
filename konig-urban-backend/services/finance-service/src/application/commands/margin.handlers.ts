import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMarginCommand } from './margin.commands';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@CommandHandler(UpdateMarginCommand)
export class UpdateMarginHandler implements ICommandHandler<UpdateMarginCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UpdateMarginCommand) {
    const { prendaId, costeProduccion, precioVenta } = command.data;

    // Calculate margin percentage: ((Venta - Coste) / Venta) * 100
    // Using simple math, rounding to 2 decimals
    const margin = precioVenta > 0 ? ((precioVenta - costeProduccion) / precioVenta) * 100 : 0;
    const margenPorcentaje = Math.round(margin * 100) / 100;

    // Check if margin already exists to do upsert or create/update manually.
    // MargenProducto doesn't have an explicit unique constraint on prendaId in schema,
    // so we should ideally find by prendaId and update the first, or create.
    const existing = await this.prisma.margenProducto.findFirst({
      where: { prendaId },
    });

    if (existing) {
      return this.prisma.margenProducto.update({
        where: { id: existing.id },
        data: {
          costeProduccion,
          precioVenta,
          margenPorcentaje,
          fechaCalculo: new Date(),
        },
      });
    }

    return this.prisma.margenProducto.create({
      data: {
        prendaId,
        costeProduccion,
        precioVenta,
        margenPorcentaje,
        fechaCalculo: new Date(),
      },
    });
  }
}
