import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MarketingController } from './presentation/marketing.controller';
import { HealthController } from './presentation/health.controller';
import { PrismaService } from './infrastructure/prisma.service';
import { MarketingRepository } from './infrastructure/marketing.repository';
import {
  AddCampaignTargetHandler,
  CreateCampaignHandler,
  SendCampaignHandler,
  UpdateCampaignHandler,
} from './application/commands/campaign.handlers';

const CommandHandlers = [
  CreateCampaignHandler,
  UpdateCampaignHandler,
  AddCampaignTargetHandler,
  SendCampaignHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [MarketingController, HealthController],
  providers: [PrismaService, MarketingRepository, ...CommandHandlers],
  exports: [MarketingRepository],
})
export class MarketingModule {}