import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand, UpdateProductCommand } from './product.commands';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateProductCommand) {
    const { data } = command;
    return this.prisma.prenda.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        gramajeAlgodon: data.gramajeAlgodon,
        material: data.material,
        imagenUrl: data.imagenUrl,
        coleccionId: data.coleccionId,
        categoriaId: data.categoriaId,
        activo: data.activo ?? true,
      },
    });
  }
}

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UpdateProductCommand) {
    const { productId, data } = command;
    return this.prisma.prenda.update({
      where: { id: productId },
      data,
    });
  }
}
