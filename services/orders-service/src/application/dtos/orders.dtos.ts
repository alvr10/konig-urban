import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min, ValidateNested } from 'class-validator';

export class OrderLineInputDto {
  @IsUUID()
  prendaId: string;

  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class CreateOrderDto {
  @IsString()
  metodoPago: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineInputDto)
  lineas: OrderLineInputDto[];
}

export enum OrderStatus {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  PROCESANDO = 'procesando',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  estado?: OrderStatus;

  @IsOptional()
  @IsString()
  operadorLogistico?: string;

  @IsOptional()
  @IsUrl()
  trackingUrl?: string;
}

export class AdminOrderFilterDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
