import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePacienteDto {
  @IsNotEmpty({ message: 'O nome do paciente é obrigatório.' })
  @IsString({ message: 'O nome deve ser um texto.' })
  nome!: string;

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
