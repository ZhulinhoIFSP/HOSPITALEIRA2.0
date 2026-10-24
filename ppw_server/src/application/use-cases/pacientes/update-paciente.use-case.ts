import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../core/errors/domain.error';
import { Paciente } from '../../../domain/entities/paciente.entity';
import { IPacienteRepository, PACIENTE_REPOSITORY } from '../../../domain/repositories/paciente.repository.interface';

export interface UpdatePacienteInput {
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
}

@Injectable()
export class UpdatePacienteUseCase {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: IPacienteRepository,
  ) {}

  async execute(id: number, input: UpdatePacienteInput): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      throw new NotFoundError(`Paciente #${id} não encontrado.`);
    }

    const atualizado = await this.pacienteRepository.update(id, {
      ...(input.nome !== undefined ? { nome: input.nome.trim() } : {}),
      ...(input.email !== undefined ? { email: input.email.trim() } : {}),
      ...(input.telefone !== undefined ? { telefone: input.telefone.trim() } : {}),
      ...(input.cpf !== undefined ? { cpf: input.cpf.trim() } : {}),
    });

    if (!atualizado) {
      throw new NotFoundError(`Paciente #${id} não encontrado.`);
    }
    return atualizado;
  }
}
