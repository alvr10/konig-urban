import { Test, TestingModule } from '@nestjs/testing';
import { GenerateMonthlyPayrollHandler } from '../../../src/application/commands/payroll.handlers';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';

describe('GenerateMonthlyPayrollHandler', () => {
  let handler: GenerateMonthlyPayrollHandler;
  let prisma: PrismaService;

  const mockPrisma = {
    empleado: {
      findMany: jest.fn(),
    },
    nomina: {
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateMonthlyPayrollHandler,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    handler = module.get<GenerateMonthlyPayrollHandler>(GenerateMonthlyPayrollHandler);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should generate payrolls with 20% flat deduction for active employees', async () => {
    mockPrisma.empleado.findMany.mockResolvedValue([
      { id: 'emp-1', salario: 1000 },
      { id: 'emp-2', salario: 2000 },
    ]);

    mockPrisma.nomina.upsert.mockResolvedValue({});

    const result = await handler.execute();
    
    expect(mockPrisma.empleado.findMany).toHaveBeenCalledWith({ where: { activo: true } });
    
    // Expect 2 upserts
    expect(mockPrisma.nomina.upsert).toHaveBeenCalledTimes(2);

    // Verify correct math for first employee (salario: 1000) -> 200 (20%) deduction -> 800 net
    expect(mockPrisma.nomina.upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        create: expect.objectContaining({
          empleadoId: 'emp-1',
          salarioBruto: 1000,
          deducciones: 200,
          salarioNeto: 800,
        })
      })
    );

    // Verify correct math for second employee (salario: 2000) -> 400 (20%) deduction -> 1600 net
    expect(mockPrisma.nomina.upsert).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        update: expect.objectContaining({
          salarioBruto: 2000,
          deducciones: 400,
          salarioNeto: 1600,
        })
      })
    );

    expect(result.message).toContain('Generated/Updated 2 payrolls');
  });
});
