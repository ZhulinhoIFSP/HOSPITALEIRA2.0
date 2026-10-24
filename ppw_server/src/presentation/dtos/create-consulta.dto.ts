import { IsInt, IsNotEmpty, Matches } from 'class-validator';

export class CreateConsultaDto {
  @IsInt({ message: 'O ID do paciente deve ser um número inteiro.' })
  pacienteId!: number;

  @IsInt({ message: 'O ID do médico deve ser um número inteiro.' })
  medicoId!: number;

  @IsNotEmpty({ message: 'A data é obrigatória.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data deve estar no formato AAAA-MM-DD.' })
  data!: string;

  @IsNotEmpty({ message: 'O horário é obrigatório.' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'O horário deve estar no formato HH:MM.' })
  horario!: string;
}
