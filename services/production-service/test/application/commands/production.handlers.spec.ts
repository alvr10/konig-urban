import { Test, TestingModule } from '@nestjs/testing';
import { CreateSupplierHandler } from '../../../src/application/commands/production.handlers';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { CreateSupplierCommand } from '../../../src/application/commands/production.commands';
import { SupplierType } from '../../../src/application/dtos/production.dto';

describe('CreateSupplierHandler', () => {
  let handler: CreateSupplierHandler;
  let prisma: PrismaService;

  const mockPrisma = {
    proveedor: {
      create: jest.fn().mockResolvedValue({ id: 'supp-1', nombre: 'Global Fabrics' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSupplierHandler,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    handler = module.get<CreateSupplierHandler>(CreateSupplierHandler);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create a supplier using prisma', async () => {
    const command = new CreateSupplierCommand({
      nombre: 'Global Fabrics',
      tipo: SupplierType.TEJIDOS,
      contacto: 'John Doe',
      email: 'john@globalfabrics.com',
      pais: 'Portugal',
    });

    const result = await handler.execute(command);

    expect(result).toEqual({ id: 'supp-1', nombre: 'Global Fabrics' });
    expect(mockPrisma.proveedor.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        nombre: 'Global Fabrics',
        tipo: SupplierType.TEJIDOS,
      }),
    });
  });
});

