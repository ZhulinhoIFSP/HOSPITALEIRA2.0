import { Injectable } from '@nestjs/common';
import { Medico } from '../../domain/entities/medico.entity';
import { IMedicoRepository } from '../../domain/repositories/medico.repository.interface';

@Injectable()
export class InMemoryMedicoRepository implements IMedicoRepository {
  private medicos: Medico[] = [
    new Medico(1, 'Ana Souza', 'Clínica Geral', 'CRM/SP 123456', '(11) 91234-5678'),
    new Medico(2, 'Carlos Mendes', 'Cardiologia', 'CRM/SP 234567', '(11) 92345-6789'),
    new Medico(3, 'João Oliveira', 'Dermatologia', 'CRM/SP 345678', '(11) 93456-7890'),
    new Medico(4, 'Marina Santos', 'Pediatria', 'CRM/SP 456789', '(11) 94567-8901'),
  ];

  async findAll(): Promise<Medico[]> {
    return [...this.medicos];
  }

  async findById(id: number): Promise<Medico | null> {
    const medico = this.medicos.find((m) => m.id === id);
    return medico ? { ...medico } : null;
  }

  async create(dados: Omit<Medico, 'id'>): Promise<Medico> {
    const proximoId = this.medicos.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    const novo = new Medico(
      proximoId,
      dados.nome,
      dados.especialidade,
      dados.crm,
      dados.telefone,
    );
    this.medicos.push(novo);
    return { ...novo };
  }

  async update(id: number, dados: Partial<Omit<Medico, 'id'>>): Promise<Medico | null> {
    const index = this.medicos.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const atual = this.medicos[index];
    const atualizado = new Medico(
      atual.id,
      dados.nome ?? atual.nome,
      dados.especialidade ?? atual.especialidade,
      dados.crm !== undefined ? dados.crm : atual.crm,
      dados.telefone !== undefined ? dados.telefone : atual.telefone,
    );

    this.medicos[index] = atualizado;
    return { ...atualizado };
  }

  async delete(id: number): Promise<boolean> {
    const index = this.medicos.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.medicos.splice(index, 1);
    return true;
  }
}
