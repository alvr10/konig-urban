import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEmployeeDto, FilterEmployeesDto } from '../../application/dtos/hr.dtos';
import { CreateEmployeeCommand } from '../../application/commands/employee.commands';
import { GetEmployeeDetailQuery, GetEmployeesQuery } from '../../application/queries/hr.queries';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getEmployees(@Query() filters: FilterEmployeesDto) {
    return this.queryBus.execute(new GetEmployeesQuery(filters));
  }

  @Post()
  async createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.commandBus.execute(new CreateEmployeeCommand(dto));
  }

  @Get(':employeeId')
  async getEmployeeDetail(@Param('employeeId') employeeId: string) {
    return this.queryBus.execute(new GetEmployeeDetailQuery(employeeId));
  }
}
