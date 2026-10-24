export type StatusConsulta =
  | 'AGENDADA'
  | 'CONFIRMADA'
  | 'CHECK_IN'
  | 'REALIZADA'
  | 'CANCELADA';

export class Consulta {
  constructor(
    public readonly id: number,
    public pacienteId: number,
    public medicoId: number,
    public data: string,
    public horario: string,
    public status: StatusConsulta,
    public readonly createdAt: string,
    public updatedAt: string,
  ) {}

  static readonly TRANSICOES_PERMITIDAS: Record<StatusConsulta, StatusConsulta[]> = {
    AGENDADA: ['CONFIRMADA', 'CANCELADA'],
    CONFIRMADA: ['CHECK_IN', 'CANCELADA'],
    CHECK_IN: ['REALIZADA'],
    REALIZADA: [],
    CANCELADA: [],
  };

  podeTransicionarPara(novoStatus: StatusConsulta): boolean {
    return Consulta.TRANSICOES_PERMITIDAS[this.status]?.includes(novoStatus) ?? false;
  }
}
