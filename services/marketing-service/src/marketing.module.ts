import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MarketingController } from './presentation/controllers/marketing.controller';

import { PrismaService } from './infrastructure/database/prisma.service';
import {
  AddCampaignTargetHandler,
  CreateCampaignHandler,
  SendCampaignHandler,
  UpdateCampaignHandler,
} from './application/commands/campaign.handlers';
import {
  GetCampaignsHandler,
  GetCampaignTargetsHandler,
} from './application/queries/campaign.handlers';

const CommandHandlers = [
  CreateCampaignHandler,
  UpdateCampaignHandler,
  AddCampaignTargetHandler,
  SendCampaignHandler,
];

const QueryHandlers = [GetCampaignsHandler, GetCampaignTargetsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [MarketingController],
  providers: [
    PrismaService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class MarketingModule { }