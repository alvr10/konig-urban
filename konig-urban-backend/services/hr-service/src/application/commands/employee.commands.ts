import { CreateEmployeeDto } from '../dtos/hr.dtos';

export class CreateEmployeeCommand {
  constructor(public readonly data: CreateEmployeeDto) {}
}
