import { FilterEmployeesDto } from '../dtos/hr.dtos';

export class GetEmployeesQuery {
  constructor(public readonly filters: FilterEmployeesDto) {}
}

export class GetEmployeeDetailQuery {
  constructor(public readonly employeeId: string) {}
}

export class GetDepartmentsQuery {}
