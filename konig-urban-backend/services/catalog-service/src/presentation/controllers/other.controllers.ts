import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCategoriesQuery, GetCollectionsQuery } from '../../application/queries/category-collection.queries';
import { GetDropsQuery, ScheduleDropCommand } from '../../application/drop.handlers';
import { GetInventoryUidsQuery } from '../../application/queries/inventory.queries';
import { DropInputDto } from '../../application/dtos/drop.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getCategories() {
    return this.queryBus.execute(new GetCategoriesQuery());
  }
}

@Controller('collections')
export class CollectionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getCollections() {
    return this.queryBus.execute(new GetCollectionsQuery());
  }
}

@Controller('drops')
export class DropsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getDrops() {
    return this.queryBus.execute(new GetDropsQuery());
  }

  @Post()
  async scheduleDrop(@Body() dto: DropInputDto) {
    return this.commandBus.execute(new ScheduleDropCommand(dto));
  }
}

@Controller('inventory/uids')
export class InventoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getInventory(
    @Query('productId') productId?: string,
    @Query('status') status?: string,
  ) {
    return this.queryBus.execute(new GetInventoryUidsQuery({ productId, status }));
  }
}
