import { IsOptional, IsString } from 'class-validator';

export class UpdatePacienteDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto.' })
  nome?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  cpf?: string;
}
