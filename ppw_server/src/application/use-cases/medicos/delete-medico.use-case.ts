import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleError, NotFoundError } from '../../../core/errors/domain.error';
import { IMedicoRepository, MEDICO_REPOSITORY } from '../../../domain/repositories/medico.repository.interface';
import { IConsultaRepository, CONSULTA_REPOSITORY } from '../../../domain/repositories/consulta.repository.interface';

@Injectable()
export class DeleteMedicoUseCase {
  constructor(
    @Inject(MEDICO_REPOSITORY)
    private readonly medicoRepository: IMedicoRepository,
    @Inject(CONSULTA_REPOSITORY)
    private readonly consultaRepository: IConsultaRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    const medico = await this.medicoRepository.findById(id);
    if (!medico) {
      throw new NotFoundError(`Médico #${id} não encontrado.`);
    }

    const consultasDoMedico = await this.consultaRepository.findByMedicoId(id);
    const temConsultasAtivas = consultasDoMedico.some(
      (c) => c.status !== 'CANCELADA' && c.status !== 'REALIZADA',
    );

    if (temConsultasAtivas) {
      throw new BusinessRuleError(
        'Não é possível excluir o médico pois ele possui consultas ativas agendadas.',
      );
    }

    for (const c of consultasDoMedico) {
      await this.consultaRepository.delete(c.id);
    }

    return this.medicoRepository.delete(id);
  }
}
