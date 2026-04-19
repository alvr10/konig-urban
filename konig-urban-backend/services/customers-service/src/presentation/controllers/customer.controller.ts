import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PrismaService } from '../../infrastructure/database/prisma.service';

import {
  UpdateCustomerByCrmCommand,
  UpdateMeCommand,
} from '../../application/commands/customer.commands';
import {
  CustomerFilterDto,
  UpdateCustomerByCrmDto,
  UpdateMeDto,
} from '../../application/dtos/customer.dto';

@Controller()
export class CustomersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly prisma: PrismaService,
  ) { }

  @Get('me')
  async getMe(@Headers('x-customer-id') customerId: string) {
    const customer = await this.prisma.cliente.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return customer;
  }

  @Patch('me')
  async updateMe(
    @Headers('x-customer-id') customerId: string,
    @Body() body: UpdateMeDto,
  ) {
    return this.commandBus.execute(new UpdateMeCommand(customerId, body));
  }

  @Get('me/membership')
  async getMyMembership(@Headers('x-customer-id') customerId: string) {
    const membership = await this.prisma.membresia.findFirst({
      where: {
        clienteId: customerId,
        activa: true,
      },
      orderBy: {
        fechaInicio: 'desc',
      },
    });

    if (!membership) {
      throw new NotFoundException('Membresía no encontrada');
    }

    return membership;
  }

  @Get('crm/customers')
  async getCrmCustomers(@Query() filters: CustomerFilterDto) {
    return this.prisma.cliente.findMany({
      where: {
        email: filters.email
          ? { contains: filters.email, mode: 'insensitive' }
          : undefined,
        tipoCliente: filters.type,
        activo:
          filters.active !== undefined ? filters.active === 'true' : undefined,
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });
  }

  @Get('crm/customers/:customerId')
  async getCustomerDetail(@Param('customerId') customerId: string) {
    const customer = await this.prisma.cliente.findUnique({
      where: { id: customerId },
      include: {
        membresia: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return customer;
  }

  @Patch('crm/customers/:customerId')
  async updateCustomerByCrm(
    @Param('customerId') customerId: string,
    @Body() body: UpdateCustomerByCrmDto,
  ) {
    return this.commandBus.execute(
      new UpdateCustomerByCrmCommand(customerId, body),
    );
  }
}