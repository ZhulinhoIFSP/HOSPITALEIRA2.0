import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicoDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto.' })
  nome?: string;

  @IsOptional()
  @IsString({ message: 'A especialidade deve ser um texto.' })
  especialidade?: string;

  @IsOptional()
  @IsString()
  crm?: string;

  @IsOptional()
  @IsString()
  telefone?: string;
}
