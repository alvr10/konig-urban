import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEmployeeCommand } from './employee.commands';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler implements ICommandHandler<CreateEmployeeCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateEmployeeCommand) {
    const data = command.data;

    // Use a transaction since we create an employee and its primary contract
    return this.prisma.$transaction(async (tx) => {
      const startOfToday = new Date();
      startOfToday.setUTCHours(0, 0, 0, 0);

      const empleado = await tx.empleado.create({
        data: {
          nombre: data.nombre,
          apellidos: data.apellidos,
          email: data.email,
          departamentoId: data.departamentoId,
          cargo: data.cargo,
          salario: data.salario,
          fechaContratacion: startOfToday,
          activo: true,
        },
      });

      if (!empleado) {
        throw new InternalServerErrorException('Failed to create employee');
      }

      // Automatically generate a primary 'indefinido' contract
      await tx.contrato.create({
        data: {
          empleadoId: empleado.id,
          tipoContrato: 'indefinido',
          fechaInicio: startOfToday,
          salarioBruto: data.salario,
          activo: true,
        },
      });

      return empleado;
    });
  }
}
