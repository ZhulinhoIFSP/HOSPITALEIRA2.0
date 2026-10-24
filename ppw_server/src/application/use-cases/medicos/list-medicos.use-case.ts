import { Inject, Injectable } from '@nestjs/common';
import { Medico } from '../../../domain/entities/medico.entity';
import { IMedicoRepository, MEDICO_REPOSITORY } from '../../../domain/repositories/medico.repository.interface';

@Injectable()
export class ListMedicosUseCase {
  constructor(
    @Inject(MEDICO_REPOSITORY)
    private readonly medicoRepository: IMedicoRepository,
  ) {}

  async execute(): Promise<Medico[]> {
    return this.medicoRepository.findAll();
  }
}
