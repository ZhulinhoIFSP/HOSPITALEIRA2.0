import { Inject, Injectable } from '@nestjs/common';
import { Paciente } from '../../../domain/entities/paciente.entity';
import { IPacienteRepository, PACIENTE_REPOSITORY } from '../../../domain/repositories/paciente.repository.interface';

@Injectable()
export class ListPacientesUseCase {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: IPacienteRepository,
  ) {}

  async execute(): Promise<Paciente[]> {
    return this.pacienteRepository.findAll();
  }
}
