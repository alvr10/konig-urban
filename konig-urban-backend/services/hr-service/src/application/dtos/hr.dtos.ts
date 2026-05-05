import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  email: string;

  @IsUUID()
  departamentoId: string;

  @IsNumber()
  @Min(0)
  salario: number;

  @IsString()
  @IsNotEmpty()
  cargo: string;
}

export class FilterEmployeesDto {
  @IsOptional()
  @IsUUID()
  deptId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  active?: boolean;
}
