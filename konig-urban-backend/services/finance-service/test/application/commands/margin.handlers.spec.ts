import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMarginHandler } from '../../../src/application/commands/margin.handlers';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { UpdateMarginCommand } from '../../../src/application/commands/margin.commands';

describe('UpdateMarginHandler', () => {
  let handler: UpdateMarginHandler;
  let prisma: PrismaService;

  const mockPrisma = {
    margenProducto: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMarginHandler,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    handler = module.get<UpdateMarginHandler>(UpdateMarginHandler);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should calculate margin percentage and create new margin if not exists', async () => {
    mockPrisma.margenProducto.findFirst.mockResolvedValue(null);
    mockPrisma.margenProducto.create.mockResolvedValue({ id: '1', margenPorcentaje: 0.5 });
    
    // Cost: 50, Price: 100 -> Margin: 50%
    const command = new UpdateMarginCommand({
      prendaId: 'prenda-1',
      costeProduccion: 50,
      precioVenta: 100,
    });

    const result = await handler.execute(command);
    
    expect(mockPrisma.margenProducto.findFirst).toHaveBeenCalledWith({ where: { prendaId: 'prenda-1' } });
    expect(mockPrisma.margenProducto.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        prendaId: 'prenda-1',
        costeProduccion: 50,
        precioVenta: 100,
        margenPorcentaje: 50, // 50%
      }),
    });
  });

  it('should calculate margin percentage and update if exists', async () => {
    mockPrisma.margenProducto.findFirst.mockResolvedValue({ id: 'margin-1' });
    mockPrisma.margenProducto.update.mockResolvedValue({ id: 'margin-1' });
    
    // Cost: 30, Price: 100 -> Margin: 70%
    const command = new UpdateMarginCommand({
      prendaId: 'prenda-2',
      costeProduccion: 30,
      precioVenta: 100,
    });

    await handler.execute(command);
    
    expect(mockPrisma.margenProducto.findFirst).toHaveBeenCalledWith({ where: { prendaId: 'prenda-2' } });
    expect(mockPrisma.margenProducto.update).toHaveBeenCalledWith({
      where: { id: 'margin-1' },
      data: expect.objectContaining({
        costeProduccion: 30,
        precioVenta: 100,
        margenPorcentaje: 70, // 70%
      }),
    });
  });
});
