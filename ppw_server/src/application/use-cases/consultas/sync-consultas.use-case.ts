import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleError } from '../../../core/errors/domain.error';
import { Consulta, StatusConsulta } from '../../../domain/entities/consulta.entity';
import { IConsultaRepository, CONSULTA_REPOSITORY } from '../../../domain/repositories/consulta.repository.interface';

@Injectable()
export class SyncConsultasUseCase {
  constructor(
    @Inject(CONSULTA_REPOSITORY)
    private readonly consultaRepository: IConsultaRepository,
  ) {}

  async execute(consultas: Consulta[]): Promise<Consulta[]> {
    if (!Array.isArray(consultas) || !consultas.every((item) => this.consultaValida(item))) {
      throw new BusinessRuleError('Lista de consultas inválida para sincronização.');
    }

    return this.consultaRepository.sincronizar(consultas);
  }

  private consultaValida(consulta: Consulta): boolean {
    const statusValidos: StatusConsulta[] = [
      'AGENDADA',
      'CONFIRMADA',
      'CHECK_IN',
      'REALIZADA',
      'CANCELADA',
    ];
    return (
      Number.isInteger(consulta.id) &&
      Number.isInteger(consulta.pacienteId) &&
      Number.isInteger(consulta.medicoId) &&
      /^\d{4}-\d{2}-\d{2}$/.test(consulta.data) &&
      /^\d{2}:\d{2}$/.test(consulta.horario) &&
      statusValidos.includes(consulta.status) &&
      typeof consulta.createdAt === 'string' &&
      typeof consulta.updatedAt === 'string'
    );
  }
}
