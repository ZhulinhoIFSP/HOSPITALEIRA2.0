import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleError, ConflictError, NotFoundError } from '../../../core/errors/domain.error';
import { Consulta, StatusConsulta } from '../../../domain/entities/consulta.entity';
import { IConsultaRepository, CONSULTA_REPOSITORY } from '../../../domain/repositories/consulta.repository.interface';
import { IPacienteRepository, PACIENTE_REPOSITORY } from '../../../domain/repositories/paciente.repository.interface';
import { IMedicoRepository, MEDICO_REPOSITORY } from '../../../domain/repositories/medico.repository.interface';

export interface UpdateConsultaInput {
  pacienteId?: number;
  medicoId?: number;
  data?: string;
  horario?: string;
  status?: StatusConsulta;
}

@Injectable()
export class UpdateConsultaUseCase {
  constructor(
    @Inject(CONSULTA_REPOSITORY)
    private readonly consultaRepository: IConsultaRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: IPacienteRepository,
    @Inject(MEDICO_REPOSITORY)
    private readonly medicoRepository: IMedicoRepository,
  ) {}

  async execute(id: number, input: UpdateConsultaInput): Promise<Consulta> {
    const consulta = await this.consultaRepository.findById(id);
    if (!consulta) {
      throw new NotFoundError(`Consulta #${id} não encontrada.`);
    }

    const pacienteId = input.pacienteId ?? consulta.pacienteId;
    const medicoId = input.medicoId ?? consulta.medicoId;
    const data = input.data ?? consulta.data;
    const horario = input.horario ?? consulta.horario;

    if (input.pacienteId !== undefined && input.pacienteId !== consulta.pacienteId) {
      const paciente = await this.pacienteRepository.findById(input.pacienteId);
      if (!paciente) {
        throw new NotFoundError(`Paciente #${input.pacienteId} não encontrado.`);
      }
    }

    if (input.medicoId !== undefined && input.medicoId !== consulta.medicoId) {
      const medico = await this.medicoRepository.findById(input.medicoId);
      if (!medico) {
        throw new NotFoundError(`Médico #${input.medicoId} não encontrado.`);
      }
    }

    if (input.status && input.status !== consulta.status) {
      if (!consulta.podeTransicionarPara(input.status)) {
        throw new BusinessRuleError(
          `Transição inválida: status atual ${consulta.status} não pode ir para ${input.status}.`,
        );
      }
    }

    const conflito = await this.consultaRepository.findByMedicoEHorario(
      medicoId,
      data,
      horario,
      id,
    );
    if (conflito) {
      throw new ConflictError('O médico já possui uma consulta agendada para esse horário.');
    }

    const atualizada = await this.consultaRepository.update(id, {
      pacienteId,
      medicoId,
      data,
      horario,
      ...(input.status ? { status: input.status } : {}),
      updatedAt: new Date().toISOString(),
    });

    if (!atualizada) {
      throw new NotFoundError(`Consulta #${id} não encontrada.`);
    }

    return atualizada;
  }
}
