import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  AddCampaignTargetDto,
  CampaignFilterDto,
  CreateCampaignDto,
  UpdateCampaignDto,
} from '../application/dtos/campaign.dto';
import {
  AddCampaignTargetCommand,
  CreateCampaignCommand,
  SendCampaignCommand,
  UpdateCampaignCommand,
} from '../application/commands/campaign.commands';
import { MarketingRepository } from '../infrastructure/marketing.repository';

@Controller('campaigns')
export class MarketingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly repository: MarketingRepository,
  ) {}

  @Get()
  async getCampaigns(@Query() filters: CampaignFilterDto) {
    return this.repository.getCampaigns(filters);
  }

  @Post()
  async createCampaign(@Body() body: CreateCampaignDto) {
    return this.commandBus.execute(new CreateCampaignCommand(body));
  }

  @Put(':campaignId')
  async updateCampaign(
    @Param('campaignId') campaignId: string,
    @Body() body: UpdateCampaignDto,
  ) {
    return this.commandBus.execute(new UpdateCampaignCommand(campaignId, body));
  }

  @Get(':campaignId/segments')
  async getCampaignTargets(@Param('campaignId') campaignId: string) {
    return this.repository.getCampaignTargets(campaignId);
  }

  @Post(':campaignId/segments')
  async addCampaignTarget(
    @Param('campaignId') campaignId: string,
    @Body() body: AddCampaignTargetDto,
  ) {
    return this.commandBus.execute(
      new AddCampaignTargetCommand(campaignId, body),
    );
  }

  @Post(':campaignId/send')
  @HttpCode(202)
  async sendCampaign(@Param('campaignId') campaignId: string) {
    return this.commandBus.execute(new SendCampaignCommand(campaignId));
  }
}