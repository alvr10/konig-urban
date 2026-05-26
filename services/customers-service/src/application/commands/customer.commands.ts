import { UpdateCustomerByCrmDto, UpdateMeDto } from '../dtos/customer.dto';

export class UpdateMeCommand {
  constructor(
    public readonly customerId: string,
    public readonly payload: UpdateMeDto,
  ) {}
}

export class UpdateCustomerByCrmCommand {
  constructor(
    public readonly customerId: string,
    public readonly payload: UpdateCustomerByCrmDto,
  ) {}
}