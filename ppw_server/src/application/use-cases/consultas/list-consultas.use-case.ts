import { Inject, Injectable } from '@nestjs/common';
import { Consulta } from '../../../domain/entities/consulta.entity';
import { IConsultaRepository, CONSULTA_REPOSITORY } from '../../../domain/repositories/consulta.repository.interface';

@Injectable()
export class ListConsultasUseCase {
  constructor(
    @Inject(CONSULTA_REPOSITORY)
    private readonly consultaRepository: IConsultaRepository,
  ) {}

  async execute(): Promise<Consulta[]> {
    return this.consultaRepository.findAll();
  }
}
