import { Test, TestingModule } from '@nestjs/testing';
import { CreateCampaignHandler } from '../../../src/application/commands/campaign.handlers';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { CreateCampaignCommand } from '../../../src/application/commands/campaign.commands';
import { CampaignType, CampaignStatus } from '../../../src/application/dtos/campaign.dto';

describe('CreateCampaignHandler', () => {
  let handler: CreateCampaignHandler;
  let prisma: PrismaService;

  const mockPrisma = {
    campana: {
      create: jest.fn().mockResolvedValue({ id: 'campaign-1', nombre: 'Summer Drop' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCampaignHandler,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    handler = module.get<CreateCampaignHandler>(CreateCampaignHandler);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create a campaign using prisma', async () => {
    const command = new CreateCampaignCommand({
      nombre: 'Summer Drop',
      tipo: CampaignType.DROP,
      fechaInicio: '2026-06-01',
      descripcion: 'Special summer drop campaign',
    });

    const result = await handler.execute(command);

    expect(result).toEqual({ id: 'campaign-1', nombre: 'Summer Drop' });
    expect(mockPrisma.campana.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        nombre: 'Summer Drop',
        tipo: CampaignType.DROP,
        estado: CampaignStatus.PLANIFICADA,
      }),
    });
  });
});
