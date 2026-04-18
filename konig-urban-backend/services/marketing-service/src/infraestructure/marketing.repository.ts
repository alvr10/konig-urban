import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CampaignFilterDto,
  CampaignStatus,
  CampaignType,
  CreateCampaignDto,
  UpdateCampaignDto,
} from '../application/dtos/campaign.dto';

@Injectable()
export class MarketingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCampaigns(filters: CampaignFilterDto) {
    return this.prisma.campaign.findMany({
      where: {
        estado: filters.status,
        tipo: filters.type,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createCampaign(payload: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        nombre: payload.nombre,
        tipo: payload.tipo as CampaignType,
        coleccionId: payload.coleccionId ?? null,
        fechaInicio: new Date(payload.fechaInicio),
        fechaFin: payload.fechaFin ? new Date(payload.fechaFin) : null,
        estado: CampaignStatus.PLANIFICADA,
        descripcion: payload.descripcion ?? null,
      },
    });
  }

  async updateCampaign(campaignId: string, payload: UpdateCampaignDto) {
    const existing = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!existing) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.prisma.campaign.update({
      where: { id: campaignId },
      data: {
        estado: payload.estado,
        nombre: payload.nombre,
        descripcion: payload.descripcion,
      },
    });
  }

  async getCampaignTargets(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.prisma.campaignTarget.findMany({
      where: { campanaId: campaignId },
      orderBy: { id: 'asc' },
    });
  }

  async addCampaignTarget(campaignId: string, clienteId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.prisma.campaignTarget.create({
      data: {
        campanaId: campaignId,
        clienteId,
        enviado: false,
        fechaEnvio: null,
      },
    });
  }

  async markCampaignTargetsAsSent(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.prisma.campaignTarget.updateMany({
      where: {
        campanaId: campaignId,
        enviado: false,
      },
      data: {
        enviado: true,
        fechaEnvio: new Date(),
      },
    });
  }
}