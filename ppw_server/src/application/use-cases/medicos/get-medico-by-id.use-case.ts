import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../core/errors/domain.error';
import { Medico } from '../../../domain/entities/medico.entity';
import { IMedicoRepository, MEDICO_REPOSITORY } from '../../../domain/repositories/medico.repository.interface';

@Injectable()
export class GetMedicoByIdUseCase {
  constructor(
    @Inject(MEDICO_REPOSITORY)
    private readonly medicoRepository: IMedicoRepository,
  ) {}

  async execute(id: number): Promise<Medico> {
    const medico = await this.medicoRepository.findById(id);
    if (!medico) {
      throw new NotFoundError(`Médico #${id} não encontrado.`);
    }
    return medico;
  }
}
