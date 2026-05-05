import { CampaignFilterDto } from '../dtos/campaign.dto';

export class GetCampaignsQuery {
  constructor(public readonly filters: CampaignFilterDto) {}
}

export class GetCampaignTargetsQuery {
  constructor(public readonly campaignId: string) {}
}