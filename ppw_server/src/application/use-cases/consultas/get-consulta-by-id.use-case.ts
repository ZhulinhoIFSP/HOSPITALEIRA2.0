import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../core/errors/domain.error';
import { Consulta } from '../../../domain/entities/consulta.entity';
import { IConsultaRepository, CONSULTA_REPOSITORY } from '../../../domain/repositories/consulta.repository.interface';

@Injectable()
export class GetConsultaByIdUseCase {
  constructor(
    @Inject(CONSULTA_REPOSITORY)
    private readonly consultaRepository: IConsultaRepository,
  ) {}

  async execute(id: number): Promise<Consulta> {
    const consulta = await this.consultaRepository.findById(id);
    if (!consulta) {
      throw new NotFoundError(`Consulta #${id} não encontrada.`);
    }
    return consulta;
  }
}
