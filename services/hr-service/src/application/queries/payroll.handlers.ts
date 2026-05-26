import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPayrollRecordsQuery } from './payroll.queries';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@QueryHandler(GetPayrollRecordsQuery)
export class GetPayrollRecordsHandler implements IQueryHandler<GetPayrollRecordsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetPayrollRecordsQuery) {
    const whereClause: any = {};
    if (query.periodo) {
      whereClause.periodo = query.periodo;
    }

    return this.prisma.nomina.findMany({
      where: whereClause,
      orderBy: [
        { periodo: 'desc' },
        { empleado: { apellidos: 'asc' } }
      ],
      include: {
        empleado: {
          select: {
            nombre: true,
            apellidos: true,
            departamentoId: true,
          }
        }
      }
    });
  }
}
