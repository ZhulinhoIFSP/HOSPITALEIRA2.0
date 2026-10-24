export type StatusConsulta =
  | 'AGENDADA'
  | 'CONFIRMADA'
  | 'CHECK_IN'
  | 'REALIZADA'
  | 'CANCELADA';

export interface Consulta {
  id: number;
  pacienteId: number;
  medicoId: number;
  data: string;
  horario: string;
  status: StatusConsulta;
  createdAt: string;
  updatedAt: string;
}

export interface Paciente {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
}

export type DadosPaciente = Omit<Paciente, 'id'>;

export interface Medico {
  id: number;
  nome: string;
  especialidade: string;
  crm?: string;
  telefone?: string;
}

export type DadosMedico = Omit<Medico, 'id'>;

export type DadosConsulta = Pick<Consulta, 'pacienteId' | 'medicoId' | 'data' | 'horario'>;
