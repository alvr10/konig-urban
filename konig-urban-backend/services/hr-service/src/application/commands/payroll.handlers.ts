import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateMonthlyPayrollCommand, PayPayrollCommand } from './payroll.commands';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

@CommandHandler(GenerateMonthlyPayrollCommand)
export class GenerateMonthlyPayrollHandler implements ICommandHandler<GenerateMonthlyPayrollCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const now = new Date();
    // Format YYYY-MM
    const periodo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    console.log(`[HR] Generating payroll for period: ${periodo}`);

    // Fetch all active employees
    const activeEmployees = await this.prisma.empleado.findMany({
      where: { activo: true },
    });

    const generatedPayrolls = [];

    // Simple flat deduction rate
    const DEDUCTION_RATE = 0.20;

    for (const emp of activeEmployees) {
      const salarioBruto = emp.salario;
      const deducciones = Number(salarioBruto) * DEDUCTION_RATE;
      const salarioNeto = Number(salarioBruto) - deducciones;

      try {
        // We use upsert so this command is idempotent for the same period
        const payroll = await this.prisma.nomina.upsert({
          where: {
            uq_nomina_empleado_periodo: {
              empleadoId: emp.id,
              periodo,
            },
          },
          update: {
            salarioBruto,
            deducciones,
            salarioNeto,
          },
          create: {
            empleadoId: emp.id,
            periodo,
            salarioBruto,
            deducciones,
            salarioNeto,
            pagada: false,
            fechaPago: null,
          },
        });
        generatedPayrolls.push(payroll);
      } catch (error) {
        console.error(`Failed to generate payroll for employee ${emp.id}`, error);
      }
    }

    return {
      message: `Generated/Updated ${generatedPayrolls.length} payrolls for ${periodo}`,
      period: periodo,
    };
  }
}

@CommandHandler(PayPayrollCommand)
export class PayPayrollHandler implements ICommandHandler<PayPayrollCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: PayPayrollCommand) {
    const existing = await this.prisma.nomina.findUnique({
      where: { id: command.payrollId },
    });

    if (!existing) {
      throw new NotFoundException('Payroll record not found');
    }

    return this.prisma.nomina.update({
      where: { id: existing.id },
      data: {
        pagada: true,
        fechaPago: new Date(),
      },
    });
  }
}
