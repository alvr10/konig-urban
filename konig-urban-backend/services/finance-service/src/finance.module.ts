import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/database/prisma.service';
import { InvoiceController } from './presentation/controllers/invoice.controller';
import { MarginController } from './presentation/controllers/margin.controller';
import { UpdateMarginHandler } from './application/commands/margin.handlers';
import {
  GetAdminInvoicesHandler,
  GetInvoiceDetailHandler,
  GetUserInvoicesHandler,
} from './application/queries/invoice.handlers';
import { GetMarginsHandler } from './application/queries/margin.handlers';

const CommandHandlers = [UpdateMarginHandler];
const QueryHandlers = [
  GetUserInvoicesHandler,
  GetInvoiceDetailHandler,
  GetAdminInvoicesHandler,
  GetMarginsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [InvoiceController, MarginController],
  providers: [PrismaService, ...CommandHandlers, ...QueryHandlers],
})
export class FinanceModule {}
