import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderHandler } from '../../../src/application/commands/orders.handlers';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { CreateOrderCommand } from '../../../src/application/commands/orders.commands';
import { NotFoundException } from '@nestjs/common';

// Quick mock for stripe to isolate unit tests
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({
            id: 'mock_session_id',
            url: 'https://checkout.stripe.com/mock-session-id',
          }),
        },
      },
    };
  });
});

describe('CreateOrderHandler', () => {
  let handler: CreateOrderHandler;
  let prisma: PrismaService;

  const mockTx = {
    prenda: { findUnique: jest.fn() },
    pedido: { create: jest.fn(), update: jest.fn() },
    envio: { create: jest.fn() },
  };

  const mockPrisma = {
    $transaction: jest.fn((callback) => callback(mockTx)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderHandler,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    handler = module.get<CreateOrderHandler>(CreateOrderHandler);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should throw NotFoundException if prenda does not exist', async () => {
    mockTx.prenda.findUnique.mockResolvedValue(null);

    const command = new CreateOrderCommand('user-1', {
      metodoPago: 'card',
      lineas: [{ prendaId: 'invalid', cantidad: 1 }],
    });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(mockTx.pedido.create).not.toHaveBeenCalled();
  });

  it('should successfully calculate total, create order, envio and stripe session', async () => {
    // Mock the prenda price internally
    mockTx.prenda.findUnique.mockResolvedValue({
      id: 'prenda-1',
      nombre: 'Puffer Jacket',
      precio: 150.0,
    });

    mockTx.pedido.create.mockResolvedValue({ id: 'order-1' });

    const command = new CreateOrderCommand('user-1', {
      metodoPago: 'card',
      lineas: [{ prendaId: 'prenda-1', cantidad: 2 }],
    });

    const result = await handler.execute(command);

    // Should fetch the price internally
    expect(mockTx.prenda.findUnique).toHaveBeenCalledWith({ where: { id: 'prenda-1' }, select: { id: true, nombre: true, precio: true } });

    // Should calculate 150.0 * 2 = 300 total mapping stripe dynamically
    expect(mockTx.pedido.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          clienteId: 'user-1',
          total: 300,
          metodoPago: 'card',
          estado: 'pendiente',
        }),
      }),
    );

    expect(mockTx.envio.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { pedidoId: 'order-1', estadoEnvio: 'pendiente' } })
    );

    expect(result).toEqual({
      id: 'order-1',
      stripeSessionUrl: 'https://checkout.stripe.com/mock-session-id',
    });
  });
});
