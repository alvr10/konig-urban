import {
  AddCampaignTargetDto,
  CreateCampaignDto,
  UpdateCampaignDto,
} from '../dtos/campaign.dto';

export class CreateCampaignCommand {
  constructor(public readonly payload: CreateCampaignDto) {}
}

export class UpdateCampaignCommand {
  constructor(
    public readonly campaignId: string,
    public readonly payload: UpdateCampaignDto,
  ) {}
}

export class AddCampaignTargetCommand {
  constructor(
    public readonly campaignId: string,
    public readonly payload: AddCampaignTargetDto,
  ) {}
}

export class SendCampaignCommand {
  constructor(public readonly campaignId: string) {}
}