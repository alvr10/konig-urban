import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../infrastructure/database/prisma.service';

import {
  UpdateCustomerByCrmCommand,
  UpdateMeCommand,
} from './customer.commands';

@CommandHandler(UpdateMeCommand)
@Injectable()
export class UpdateMeHandler implements ICommandHandler<UpdateMeCommand> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(command: UpdateMeCommand) {
    const { customerId, payload } = command;

    const customer = await this.prisma.cliente.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return this.prisma.cliente.update({
      where: { id: customerId },
      data: {
        nombre: payload.nombre,
        apellidos: payload.apellidos,
        telefono: payload.telefono,
        direccion: payload.direccion,
      },
    });
  }
}

@CommandHandler(UpdateCustomerByCrmCommand)
@Injectable()
export class UpdateCustomerByCrmHandler
  implements ICommandHandler<UpdateCustomerByCrmCommand> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(command: UpdateCustomerByCrmCommand) {
    const { customerId, payload } = command;

    const customer = await this.prisma.cliente.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return this.prisma.cliente.update({
      where: { id: customerId },
      data: {
        tipoCliente: payload.tipoCliente,
        activo: payload.activo,
      },
    });
  }
}