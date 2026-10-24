import { Inject, Injectable } from '@nestjs/common';
import { Medico } from '../../../domain/entities/medico.entity';
import { IMedicoRepository, MEDICO_REPOSITORY } from '../../../domain/repositories/medico.repository.interface';

export interface CreateMedicoInput {
  nome: string;
  especialidade: string;
  crm?: string;
  telefone?: string;
}

@Injectable()
export class CreateMedicoUseCase {
  constructor(
    @Inject(MEDICO_REPOSITORY)
    private readonly medicoRepository: IMedicoRepository,
  ) {}

  async execute(input: CreateMedicoInput): Promise<Medico> {
    return this.medicoRepository.create({
      nome: input.nome.trim(),
      especialidade: input.especialidade.trim(),
      crm: input.crm?.trim(),
      telefone: input.telefone?.trim(),
    });
  }
}
