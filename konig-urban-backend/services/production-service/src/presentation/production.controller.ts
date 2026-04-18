import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PrismaService } from '../infrastructure/prisma.service';
import {
  CreatePurchaseOrderCommand,
  CreateQualityCheckCommand,
  CreateSupplierCommand,
  UpdatePurchaseOrderCommand,
} from '../application/commands/production.commands';
import {
  CreatePurchaseOrderDto,
  CreateQualityCheckDto,
  CreateSupplierDto,
  PurchaseOrderFilterDto,
  SupplierFilterDto,
} from '../application/dtos/production.dto';

@Controller()
export class ProductionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly prisma: PrismaService,
  ) {}

  @Get('suppliers')
  async getSuppliers(@Query() filters: SupplierFilterDto) {
    return this.prisma.proveedor.findMany({
      where: {
        tipo: filters.type,
        activo:
          filters.active !== undefined ? filters.active === 'true' : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Post('suppliers')
  async createSupplier(@Body() body: CreateSupplierDto) {
    return this.commandBus.execute(new CreateSupplierCommand(body));
  }

  @Get('purchase-orders')
  async getPurchaseOrders(@Query() filters: PurchaseOrderFilterDto) {
    return this.prisma.ordenCompra.findMany({
      where: {
        estado: filters.status,
      },
      include: {
        lineas: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Post('purchase-orders')
  async createPurchaseOrder(@Body() body: CreatePurchaseOrderDto) {
    return this.commandBus.execute(new CreatePurchaseOrderCommand(body));
  }

  @Patch('purchase-orders/:orderId')
  async updatePurchaseOrder(
    @Param('orderId') orderId: string,
    @Body() body: any,
  ) {
    return this.commandBus.execute(new UpdatePurchaseOrderCommand(orderId, body));
  }

  @Get('quality-checks')
  async getQualityChecks() {
    return this.prisma.controlCalidad.findMany({
      orderBy: {
        fechaRevision: 'desc',
      },
    });
  }

  @Post('quality-checks')
  async createQualityCheck(@Body() body: CreateQualityCheckDto) {
    return this.commandBus.execute(new CreateQualityCheckCommand(body));
  }
}