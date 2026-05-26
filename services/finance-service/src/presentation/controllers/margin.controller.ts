import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateMarginCommand } from '../../application/commands/margin.commands';
import { GetMarginsQuery } from '../../application/queries/margin.queries';
import { UpdateMarginDto } from '../../application/dtos/finance.dtos';

@Controller('admin/margins')
export class MarginController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getMargins(@Query('prendaId') prendaId?: string) {
    return this.queryBus.execute(new GetMarginsQuery(prendaId));
  }

  @Post()
  async updateMargin(@Body() dto: UpdateMarginDto) {
    return this.commandBus.execute(new UpdateMarginCommand(dto));
  }
}
