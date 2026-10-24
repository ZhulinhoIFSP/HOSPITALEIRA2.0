import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicoDto {
  @IsNotEmpty({ message: 'O nome do médico é obrigatório.' })
  @IsString({ message: 'O nome deve ser um texto.' })
  nome!: string;

  @IsNotEmpty({ message: 'A especialidade é obrigatória.' })
  @IsString({ message: 'A especialidade deve ser um texto.' })
  especialidade!: string;

  @IsOptional()
  @IsString()
  crm?: string;

  @IsOptional()
  @IsString()
  telefone?: string;
}
