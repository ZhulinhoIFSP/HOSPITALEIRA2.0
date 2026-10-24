import { Medico } from '../entities/medico.entity';

export const MEDICO_REPOSITORY = 'MEDICO_REPOSITORY';

export interface IMedicoRepository {
  findAll(): Promise<Medico[]>;
  findById(id: number): Promise<Medico | null>;
  create(dados: Omit<Medico, 'id'>): Promise<Medico>;
  update(id: number, dados: Partial<Omit<Medico, 'id'>>): Promise<Medico | null>;
  delete(id: number): Promise<boolean>;
}
