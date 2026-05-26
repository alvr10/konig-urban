import { CustomerFilterDto } from '../dtos/customer.dto';

export class GetMeQuery {
  constructor(public readonly customerId: string) {}
}

export class GetMyMembershipQuery {
  constructor(public readonly customerId: string) {}
}

export class GetCrmCustomersQuery {
  constructor(public readonly filters: CustomerFilterDto) {}
}

export class GetCustomerDetailQuery {
  constructor(public readonly customerId: string) {}
}