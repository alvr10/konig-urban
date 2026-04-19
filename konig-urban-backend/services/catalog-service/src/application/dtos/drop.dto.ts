import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class DropInputDto {
  @IsUUID()
  @IsNotEmpty()
  coleccionId: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
