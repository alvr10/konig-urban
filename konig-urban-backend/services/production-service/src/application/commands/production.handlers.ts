import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma.service';
import {
  CreatePurchaseOrderCommand,
  CreateQualityCheckCommand,
  CreateSupplierCommand,
  UpdatePurchaseOrderCommand,
} from './production.commands';
import {
  PurchaseOrderStatus,
  QualityCheckResult,
  SupplierType,
} from '../dtos/production.dto';

@CommandHandler(CreateSupplierCommand)
@Injectable()
export class CreateSupplierHandler
  implements ICommandHandler<CreateSupplierCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateSupplierCommand) {
    const { nombre, tipo, contacto, email, pais } = command.payload;

    return this.prisma.proveedor.create({
      data: {
        nombre,
        tipo: tipo as SupplierType,
        contacto: contacto ?? null,
        email,
        pais: pais ?? null,
        activo: true,
      },
    });
  }
}

@CommandHandler(CreatePurchaseOrderCommand)
@Injectable()
export class CreatePurchaseOrderHandler
  implements ICommandHandler<CreatePurchaseOrderCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreatePurchaseOrderCommand) {
    const { proveedorId, fecha, notas, lineas } = command.payload;

    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: proveedorId },
    });

    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    if (!lineas.length) {
      throw new BadRequestException(
        'La orden de compra debe tener al menos una línea',
      );
    }

    const total = lineas.reduce((acc, linea) => {
      return acc + linea.cantidad * linea.precioUnitario;
    }, 0);

    return this.prisma.ordenCompra.create({
      data: {
        proveedorId,
        fecha: new Date(fecha),
        estado: PurchaseOrderStatus.BORRADOR,
        total: new Prisma.Decimal(total),
        notas: notas ?? null,
        lineas: {
          create: lineas.map((linea) => ({
            descripcionMaterial: linea.descripcionMaterial,
            cantidad: linea.cantidad,
            precioUnitario: new Prisma.Decimal(linea.precioUnitario),
          })),
        },
      },
      include: {
        lineas: true,
      },
    });
  }
}

@CommandHandler(UpdatePurchaseOrderCommand)
@Injectable()
export class UpdatePurchaseOrderHandler
  implements ICommandHandler<UpdatePurchaseOrderCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UpdatePurchaseOrderCommand) {
    const { orderId, payload } = command;

    const order = await this.prisma.ordenCompra.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Orden de compra no encontrada');
    }

    return this.prisma.ordenCompra.update({
      where: { id: orderId },
      data: {
        estado: payload.estado,
        notas: payload.notas,
      },
    });
  }
}

@CommandHandler(CreateQualityCheckCommand)
@Injectable()
export class CreateQualityCheckHandler
  implements ICommandHandler<CreateQualityCheckCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateQualityCheckCommand) {
    const { prendaId, inspector, resultado, notas } = command.payload;

    return this.prisma.controlCalidad.create({
      data: {
        prendaId,
        inspector,
        fechaRevision: new Date(),
        resultado: resultado as QualityCheckResult,
        notas: notas ?? null,
      },
    });
  }
}