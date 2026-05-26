import {
  IsArray,
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SupplierType {
  TEJIDOS = 'tejidos',
  FABRICACION = 'fabricacion',
  PACKAGING = 'packaging',
}

export enum PurchaseOrderStatus {
  BORRADOR = 'borrador',
  CONFIRMADA = 'confirmada',
  RECIBIDA = 'recibida',
  CANCELADA = 'cancelada',
}

export enum QualityCheckResult {
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
}

export class SupplierFilterDto {
  @IsOptional()
  @IsEnum(SupplierType)
  type?: SupplierType;

  @IsOptional()
  @IsBooleanString()
  active?: string;
}

export class CreateSupplierDto {
  @IsString()
  nombre!: string;

  @IsEnum(SupplierType)
  tipo!: SupplierType;

  @IsOptional()
  @IsString()
  contacto?: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  pais?: string;
}

export class PurchaseOrderFilterDto {
  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;
}

export class CreatePurchaseOrderLineDto {
  @IsString()
  descripcionMaterial!: string;

  @IsInt()
  @Min(1)
  cantidad!: number;

  @IsNumber()
  @Min(0)
  precioUnitario!: number;
}

export class CreatePurchaseOrderDto {
  @IsUUID()
  proveedorId!: string;

  @IsDateString()
  fecha!: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineDto)
  lineas!: CreatePurchaseOrderLineDto[];
}

export class UpdatePurchaseOrderDto {
  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  estado?: PurchaseOrderStatus;

  @IsOptional()
  @IsString()
  notas?: string;
}

export class CreateQualityCheckDto {
  @IsUUID()
  prendaId!: string;

  @IsString()
  inspector!: string;

  @IsEnum(QualityCheckResult)
  resultado!: QualityCheckResult;

  @IsOptional()
  @IsString()
  notas?: string;
}