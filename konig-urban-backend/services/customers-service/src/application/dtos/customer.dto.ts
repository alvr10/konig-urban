import {
  IsBoolean,
  IsBooleanString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum CustomerType {
  ESTANDAR = 'estandar',
  VIP = 'vip',
  STAFF = 'staff',
}

export enum MembershipLevel {
  BRONCE = 'bronce',
  PLATA = 'plata',
  ORO = 'oro',
  PLATINO = 'platino',
}

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}

export class CustomerFilterDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;

  @IsOptional()
  @IsBooleanString()
  active?: string;
}

export class UpdateCustomerByCrmDto {
  @IsOptional()
  @IsEnum(CustomerType)
  tipoCliente?: CustomerType;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}