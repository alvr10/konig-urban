import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetDepartmentsQuery } from '../../application/queries/hr.queries';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getDepartments() {
    return this.queryBus.execute(new GetDepartmentsQuery());
  }
}
