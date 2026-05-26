import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductHandler } from '../../../src/application/commands/product.handlers';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { CreateProductCommand } from '../../../src/application/commands/product.commands';

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;
  let prisma: PrismaService;

  const mockPrisma = {
    prenda: {
      create: jest.fn().mockResolvedValue({ id: '1', nombre: 'Test Jacket' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductHandler,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    handler = module.get<CreateProductHandler>(CreateProductHandler);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create a product using prisma', async () => {
    const command = new CreateProductCommand({
      nombre: 'Test Jacket',
      precio: 99.99,
      gramajeAlgodon: 400,
      material: 'Cotton',
      imagenUrl: 'http://test.com/image.jpg',
      coleccionId: 'coll-1',
      categoriaId: 'cat-1',
    });

    const result = await handler.execute(command);

    expect(result).toEqual({ id: '1', nombre: 'Test Jacket' });
    expect(mockPrisma.prenda.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        nombre: 'Test Jacket',
        precio: 99.99,
      }),
    });
  });
});
