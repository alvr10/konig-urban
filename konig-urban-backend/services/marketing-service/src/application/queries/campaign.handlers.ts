import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { GetCampaignsQuery, GetCampaignTargetsQuery } from './campaign.queries';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetCampaignsQuery)
export class GetCampaignsHandler implements IQueryHandler<GetCampaignsQuery> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(query: GetCampaignsQuery) {
    const { filters } = query;
    return this.prisma.campana.findMany({
      where: {
        estado: filters.status,
        tipo: filters.type,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

@QueryHandler(GetCampaignTargetsQuery)
export class GetCampaignTargetsHandler
  implements IQueryHandler<GetCampaignTargetsQuery> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(query: GetCampaignTargetsQuery) {
    const { campaignId } = query;

    const campaign = await this.prisma.campana.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.prisma.clienteCampana.findMany({
      where: { campanaId: campaignId },
      orderBy: { id: 'asc' },
    });
  }
}

