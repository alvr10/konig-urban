import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateMarginDto {
  @IsUUID()
  prendaId: string;

  @IsNumber()
  @Min(0)
  costeProduccion: number;

  @IsNumber()
  @Min(0)
  precioVenta: number;
}

export enum InvoiceStatus {
  EMITIDA = 'emitida',
  PAGADA = 'pagada',
  ANULADA = 'anulada',
}

export class AdminInvoicesFilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}
