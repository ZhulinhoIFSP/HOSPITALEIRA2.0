import { Paciente } from '../entities/paciente.entity';

export const PACIENTE_REPOSITORY = 'PACIENTE_REPOSITORY';

export interface IPacienteRepository {
  findAll(): Promise<Paciente[]>;
  findById(id: number): Promise<Paciente | null>;
  create(dados: Omit<Paciente, 'id'>): Promise<Paciente>;
  update(id: number, dados: Partial<Omit<Paciente, 'id'>>): Promise<Paciente | null>;
  delete(id: number): Promise<boolean>;
}
