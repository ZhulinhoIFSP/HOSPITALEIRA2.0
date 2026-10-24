import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../core/errors/domain.error';
import { Paciente } from '../../../domain/entities/paciente.entity';
import { IPacienteRepository, PACIENTE_REPOSITORY } from '../../../domain/repositories/paciente.repository.interface';

@Injectable()
export class GetPacienteByIdUseCase {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: IPacienteRepository,
  ) {}

  async execute(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      throw new NotFoundError(`Paciente #${id} não encontrado.`);
    }
    return paciente;
  }
}
