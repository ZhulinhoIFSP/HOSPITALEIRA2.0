import { Inject, Injectable } from '@nestjs/common';
import { Paciente } from '../../../domain/entities/paciente.entity';
import { IPacienteRepository, PACIENTE_REPOSITORY } from '../../../domain/repositories/paciente.repository.interface';

export interface CreatePacienteInput {
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
}

@Injectable()
export class CreatePacienteUseCase {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: IPacienteRepository,
  ) {}

  async execute(input: CreatePacienteInput): Promise<Paciente> {
    return this.pacienteRepository.create({
      nome: input.nome.trim(),
      email: input.email?.trim(),
      telefone: input.telefone?.trim(),
      cpf: input.cpf?.trim(),
    });
  }
}
