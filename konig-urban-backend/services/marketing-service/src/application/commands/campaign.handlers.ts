import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AddCampaignTargetCommand,
  CreateCampaignCommand,
  SendCampaignCommand,
  UpdateCampaignCommand,
} from './campaign.commands';
import { MarketingRepository } from '../../infrastructure/marketing.repository';

@CommandHandler(CreateCampaignCommand)
export class CreateCampaignHandler
  implements ICommandHandler<CreateCampaignCommand>
{
  constructor(private readonly repository: MarketingRepository) {}

  async execute(command: CreateCampaignCommand) {
    return this.repository.createCampaign(command.payload);
  }
}

@CommandHandler(UpdateCampaignCommand)
export class UpdateCampaignHandler
  implements ICommandHandler<UpdateCampaignCommand>
{
  constructor(private readonly repository: MarketingRepository) {}

  async execute(command: UpdateCampaignCommand) {
    return this.repository.updateCampaign(command.campaignId, command.payload);
  }
}

@CommandHandler(AddCampaignTargetCommand)
export class AddCampaignTargetHandler
  implements ICommandHandler<AddCampaignTargetCommand>
{
  constructor(private readonly repository: MarketingRepository) {}

  async execute(command: AddCampaignTargetCommand) {
    return this.repository.addCampaignTarget(
      command.campaignId,
      command.payload.clienteId,
    );
  }
}

@CommandHandler(SendCampaignCommand)
export class SendCampaignHandler implements ICommandHandler<SendCampaignCommand> {
  constructor(private readonly repository: MarketingRepository) {}

  async execute(command: SendCampaignCommand) {
    await this.repository.markCampaignTargetsAsSent(command.campaignId);

    return {
      accepted: true,
      message: 'Proceso de envío iniciado de forma asíncrona.',
    };
  }
}