import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AddCampaignTargetCommand,
  CreateCampaignCommand,
  SendCampaignCommand,
  UpdateCampaignCommand,
} from './campaign.commands';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CampaignStatus, CampaignType } from '../dtos/campaign.dto';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateCampaignCommand)
export class CreateCampaignHandler
  implements ICommandHandler<CreateCampaignCommand> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(command: CreateCampaignCommand) {
    const { payload } = command;
    return this.prisma.campana.create({
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
}

@CommandHandler(UpdateCampaignCommand)
export class UpdateCampaignHandler
  implements ICommandHandler<UpdateCampaignCommand> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(command: UpdateCampaignCommand) {
    const { campaignId, payload } = command;

    const existing = await this.prisma.campana.findUnique({
      where: { id: campaignId },
    });

    if (!existing) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.prisma.campana.update({
      where: { id: campaignId },
      data: {
        estado: payload.estado,
        nombre: payload.nombre,
        descripcion: payload.descripcion,
      },
    });
  }
}

@CommandHandler(AddCampaignTargetCommand)
export class AddCampaignTargetHandler
  implements ICommandHandler<AddCampaignTargetCommand> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(command: AddCampaignTargetCommand) {
    const { campaignId, payload } = command;

    const campaign = await this.prisma.campana.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.prisma.clienteCampana.create({
      data: {
        campanaId: campaignId,
        clienteId: payload.clienteId,
        enviado: false,
        fechaEnvio: null,
      },
    });
  }
}

@CommandHandler(SendCampaignCommand)
export class SendCampaignHandler implements ICommandHandler<SendCampaignCommand> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(command: SendCampaignCommand) {
    const { campaignId } = command;

    const campaign = await this.prisma.campana.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    await this.prisma.clienteCampana.updateMany({
      where: {
        campanaId: campaignId,
        enviado: false,
      },
      data: {
        enviado: true,
        fechaEnvio: new Date(),
      },
    });

    return {
      accepted: true,
      message: 'Proceso de envío iniciado de forma asíncrona.',
    };
  }
}