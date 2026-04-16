import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GenerateMonthlyPayrollCommand, PayPayrollCommand } from '../../application/commands/payroll.commands';
import { GetPayrollRecordsQuery } from '../../application/queries/payroll.queries';

@Controller('payroll')
export class PayrollController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getPayrolls(@Query('periodo') periodo?: string) {
    return this.queryBus.execute(new GetPayrollRecordsQuery(periodo));
  }

  @Post()
  async generatePayroll() {
    return this.commandBus.execute(new GenerateMonthlyPayrollCommand());
  }

  @Post(':payrollId/pay')
  async payPayroll(@Param('payrollId') payrollId: string) {
    return this.commandBus.execute(new PayPayrollCommand(payrollId));
  }
}
