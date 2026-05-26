import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ProductInputDto, ProductUpdateDto } from '../../application/dtos/product.dto';
import { CreateProductCommand, UpdateProductCommand } from '../../application/commands/product.commands';
import { GetProductsQuery, GetProductDetailQuery } from '../../application/queries/product.queries';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('collectionId') collectionId?: string,
    @Query('search') search?: string,
    @Query('active') active?: string, // Comes as string from query
  ) {
    const isActive = active === 'false' ? false : active === 'true' ? true : undefined;
    return this.queryBus.execute(new GetProductsQuery({ categoryId, collectionId, search, active: isActive }));
  }

  @Post()
  async createProduct(@Body() dto: ProductInputDto) {
    return this.commandBus.execute(new CreateProductCommand(dto));
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    return this.queryBus.execute(new GetProductDetailQuery(productId));
  }

  @Patch(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() dto: ProductUpdateDto,
  ) {
    return this.commandBus.execute(new UpdateProductCommand(productId, dto));
  }
}
