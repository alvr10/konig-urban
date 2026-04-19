import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductInputDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  precio: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  gramajeAlgodon?: number;

  @IsString()
  @IsOptional()
  material?: string;

  @IsUrl()
  @IsOptional()
  imagenUrl?: string;

  @IsUUID()
  @IsNotEmpty()
  coleccionId: string;

  @IsUUID()
  @IsNotEmpty()
  categoriaId: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class ProductUpdateDto extends ProductInputDto {} // Partial implementation handled via PartialType if we had @nestjs/swagger but for raw DTOs we can make everything optional here or just reuse.
