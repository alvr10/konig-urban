import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum CampaignType {
  NEWSLETTER = 'newsletter',
  INFLUENCER = 'influencer',
  REDES = 'redes',
  DROP = 'drop',
}

export enum CampaignStatus {
  PLANIFICADA = 'planificada',
  ACTIVA = 'activa',
  FINALIZADA = 'finalizada',
  CANCELADA = 'cancelada',
}

export class CreateCampaignDto {
  @IsString()
  nombre!: string;

  @IsEnum(CampaignType)
  tipo!: CampaignType;

  @IsOptional()
  @IsUUID()
  coleccionId?: string;

  @IsDateString()
  fechaInicio!: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}

export class UpdateCampaignDto {
  @IsOptional()
  @IsEnum(CampaignStatus)
  estado?: CampaignStatus;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}

export class AddCampaignTargetDto {
  @IsUUID()
  clienteId!: string;
}

export class CampaignFilterDto {
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsEnum(CampaignType)
  type?: CampaignType;
}

export class CampaignTargetDto {
  id!: string;
  campanaId!: string;
  clienteId!: string;
  enviado!: boolean;
  fechaEnvio!: Date | null;
}

export class SendCampaignResponseDto {
  @IsBoolean()
  accepted!: boolean;

  @IsString()
  message!: string;
}