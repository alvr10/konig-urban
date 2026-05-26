import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/database/prisma.service';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { PayrollController } from './presentation/controllers/payroll.controller';
import { DepartmentController } from './presentation/controllers/department.controller';
import { CreateEmployeeHandler } from './application/commands/employee.handlers';
import { GenerateMonthlyPayrollHandler, PayPayrollHandler } from './application/commands/payroll.handlers';
import { GetDepartmentsHandler, GetEmployeeDetailHandler, GetEmployeesHandler } from './application/queries/hr.handlers';
import { GetPayrollRecordsHandler } from './application/queries/payroll.handlers';

const CommandHandlers = [
  CreateEmployeeHandler,
  GenerateMonthlyPayrollHandler,
  PayPayrollHandler,
];

const QueryHandlers = [
  GetEmployeesHandler,
  GetEmployeeDetailHandler,
  GetDepartmentsHandler,
  GetPayrollRecordsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [EmployeeController, PayrollController, DepartmentController],
  providers: [PrismaService, ...CommandHandlers, ...QueryHandlers],
})
export class HrModule {}
