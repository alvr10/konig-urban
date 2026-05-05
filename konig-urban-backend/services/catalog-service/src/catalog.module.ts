import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/database/prisma.service';

// Controllers
import { ProductsController } from './presentation/controllers/products.controller';
import { CategoriesController, CollectionsController, DropsController, InventoryController } from './presentation/controllers/other.controllers';

// Handlers
import { CreateProductHandler, UpdateProductHandler } from './application/commands/product.handlers';
import { GetProductsHandler, GetProductDetailHandler } from './application/queries/product.queries';
import { GetCategoriesHandler, GetCollectionsHandler } from './application/queries/category-collection.queries';
import { GetDropsHandler, ScheduleDropHandler } from './application/drop.handlers';
import { GetInventoryUidsHandler } from './application/queries/inventory.queries';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  ScheduleDropHandler,
];

const QueryHandlers = [
  GetProductsHandler,
  GetProductDetailHandler,
  GetCategoriesHandler,
  GetCollectionsHandler,
  GetDropsHandler,
  GetInventoryUidsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [
    ProductsController,
    CategoriesController,
    CollectionsController,
    DropsController,
    InventoryController,
  ],
  providers: [
    PrismaService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [PrismaService], // Exported in case it's needed externally
})
export class CatalogModule {}
