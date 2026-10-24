import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleError, NotFoundError } from '../../../core/errors/domain.error';
import { IPacienteRepository, PACIENTE_REPOSITORY } from '../../../domain/repositories/paciente.repository.interface';
import { IConsultaRepository, CONSULTA_REPOSITORY } from '../../../domain/repositories/consulta.repository.interface';

@Injectable()
export class DeletePacienteUseCase {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: IPacienteRepository,
    @Inject(CONSULTA_REPOSITORY)
    private readonly consultaRepository: IConsultaRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      throw new NotFoundError(`Paciente #${id} não encontrado.`);
    }

    const consultasDoPaciente = await this.consultaRepository.findByPacienteId(id);
    const temConsultasAtivas = consultasDoPaciente.some(
      (c) => c.status !== 'CANCELADA' && c.status !== 'REALIZADA',
    );

    if (temConsultasAtivas) {
      throw new BusinessRuleError(
        'Não é possível excluir o paciente pois ele possui consultas ativas agendadas.',
      );
    }

    // Se possui apenas consultas canceladas/realizadas, podemos limpar ou permitir
    for (const c of consultasDoPaciente) {
      await this.consultaRepository.delete(c.id);
    }

    return this.pacienteRepository.delete(id);
  }
}
