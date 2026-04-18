import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMeHandler } from '../../../src/application/commands/customer.handlers';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { UpdateMeCommand } from '../../../src/application/commands/customer.commands';

describe('UpdateMeHandler', () => {
  let handler: UpdateMeHandler;
  let prisma: PrismaService;

  const mockPrisma = {
    cliente: {
      findUnique: jest.fn().mockResolvedValue({ id: 'cust-1', nombre: 'Old Name' }),
      update: jest.fn().mockResolvedValue({ id: 'cust-1', nombre: 'New Name' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMeHandler,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    handler = module.get<UpdateMeHandler>(UpdateMeHandler);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should update customer profile', async () => {
    const command = new UpdateMeCommand('cust-1', {
      nombre: 'New Name',
      apellidos: 'New Surname',
    });


    const result = await handler.execute(command);

    expect(result).toEqual({ id: 'cust-1', nombre: 'New Name' });
    expect(mockPrisma.cliente.update).toHaveBeenCalledWith({
      where: { id: 'cust-1' },
      data: expect.objectContaining({
        nombre: 'New Name',
      }),
    });
  });
});
