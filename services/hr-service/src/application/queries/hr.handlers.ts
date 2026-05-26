import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import {
  GetDepartmentsQuery,
  GetEmployeeDetailQuery,
  GetEmployeesQuery,
} from './hr.queries';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(GetEmployeesQuery)
export class GetEmployeesHandler implements IQueryHandler<GetEmployeesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetEmployeesQuery) {
    const { deptId, active } = query.filters;
    const where: any = {};

    if (deptId) {
      where.departamentoId = deptId;
    }

    if (active !== undefined) {
      where.activo = active;
    }

    return this.prisma.empleado.findMany({
      where,
      orderBy: { apellidos: 'asc' },
    });
  }
}

@QueryHandler(GetEmployeeDetailQuery)
export class GetEmployeeDetailHandler implements IQueryHandler<GetEmployeeDetailQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetEmployeeDetailQuery) {
    const employee = await this.prisma.empleado.findUnique({
      where: { id: query.employeeId },
      include: {
        contratos: {
          orderBy: { fechaInicio: 'desc' },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }
}

@QueryHandler(GetDepartmentsQuery)
export class GetDepartmentsHandler implements IQueryHandler<GetDepartmentsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.departamento.findMany({
      include: {
        empleados: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            cargo: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
