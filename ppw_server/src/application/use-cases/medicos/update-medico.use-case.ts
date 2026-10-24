import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../core/errors/domain.error';
import { Medico } from '../../../domain/entities/medico.entity';
import { IMedicoRepository, MEDICO_REPOSITORY } from '../../../domain/repositories/medico.repository.interface';

export interface UpdateMedicoInput {
  nome?: string;
  especialidade?: string;
  crm?: string;
  telefone?: string;
}

@Injectable()
export class UpdateMedicoUseCase {
  constructor(
    @Inject(MEDICO_REPOSITORY)
    private readonly medicoRepository: IMedicoRepository,
  ) {}

  async execute(id: number, input: UpdateMedicoInput): Promise<Medico> {
    const medico = await this.medicoRepository.findById(id);
    if (!medico) {
      throw new NotFoundError(`Médico #${id} não encontrado.`);
    }

    const atualizado = await this.medicoRepository.update(id, {
      ...(input.nome !== undefined ? { nome: input.nome.trim() } : {}),
      ...(input.especialidade !== undefined ? { especialidade: input.especialidade.trim() } : {}),
      ...(input.crm !== undefined ? { crm: input.crm.trim() } : {}),
      ...(input.telefone !== undefined ? { telefone: input.telefone.trim() } : {}),
    });

    if (!atualizado) {
      throw new NotFoundError(`Médico #${id} não encontrado.`);
    }
    return atualizado;
  }
}
