import { Inject, Injectable } from '@nestjs/common';
import { ConflictError, NotFoundError } from '../../../core/errors/domain.error';
import { Consulta } from '../../../domain/entities/consulta.entity';
import { IConsultaRepository, CONSULTA_REPOSITORY } from '../../../domain/repositories/consulta.repository.interface';
import { IPacienteRepository, PACIENTE_REPOSITORY } from '../../../domain/repositories/paciente.repository.interface';
import { IMedicoRepository, MEDICO_REPOSITORY } from '../../../domain/repositories/medico.repository.interface';

export interface CreateConsultaInput {
  pacienteId: number;
  medicoId: number;
  data: string;
  horario: string;
}

@Injectable()
export class CreateConsultaUseCase {
  constructor(
    @Inject(CONSULTA_REPOSITORY)
    private readonly consultaRepository: IConsultaRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: IPacienteRepository,
    @Inject(MEDICO_REPOSITORY)
    private readonly medicoRepository: IMedicoRepository,
  ) {}

  async execute(input: CreateConsultaInput): Promise<Consulta> {
    const paciente = await this.pacienteRepository.findById(input.pacienteId);
    if (!paciente) {
      throw new NotFoundError(`Paciente #${input.pacienteId} não encontrado.`);
    }

    const medico = await this.medicoRepository.findById(input.medicoId);
    if (!medico) {
      throw new NotFoundError(`Médico #${input.medicoId} não encontrado.`);
    }

    const conflito = await this.consultaRepository.findByMedicoEHorario(
      input.medicoId,
      input.data,
      input.horario,
    );
    if (conflito) {
      throw new ConflictError('O médico já possui uma consulta agendada para esse horário.');
    }

    return this.consultaRepository.create({
      pacienteId: input.pacienteId,
      medicoId: input.medicoId,
      data: input.data,
      horario: input.horario,
      status: 'AGENDADA',
    });
  }
}
