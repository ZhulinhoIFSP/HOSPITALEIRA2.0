import { Injectable } from '@nestjs/common';
import { Paciente } from '../../domain/entities/paciente.entity';
import { IPacienteRepository } from '../../domain/repositories/paciente.repository.interface';

@Injectable()
export class InMemoryPacienteRepository implements IPacienteRepository {
  private pacientes: Paciente[] = [
    new Paciente(1, 'Maria Silva', 'maria.silva@email.com', '(11) 98765-4321', '123.456.789-01'),
    new Paciente(2, 'Pedro Almeida', 'pedro.almeida@email.com', '(11) 97654-3210', '234.567.890-12'),
    new Paciente(3, 'Lara Costa', 'lara.costa@email.com', '(11) 96543-2109', '345.678.901-23'),
    new Paciente(4, 'Rafael Lima', 'rafael.lima@email.com', '(11) 95432-1098', '456.789.012-34'),
  ];

  async findAll(): Promise<Paciente[]> {
    return [...this.pacientes];
  }

  async findById(id: number): Promise<Paciente | null> {
    const paciente = this.pacientes.find((p) => p.id === id);
    return paciente ? { ...paciente } : null;
  }

  async create(dados: Omit<Paciente, 'id'>): Promise<Paciente> {
    const proximoId = this.pacientes.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const novo = new Paciente(
      proximoId,
      dados.nome,
      dados.email,
      dados.telefone,
      dados.cpf,
    );
    this.pacientes.push(novo);
    return { ...novo };
  }

  async update(id: number, dados: Partial<Omit<Paciente, 'id'>>): Promise<Paciente | null> {
    const index = this.pacientes.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const atual = this.pacientes[index];
    const atualizado = new Paciente(
      atual.id,
      dados.nome ?? atual.nome,
      dados.email !== undefined ? dados.email : atual.email,
      dados.telefone !== undefined ? dados.telefone : atual.telefone,
      dados.cpf !== undefined ? dados.cpf : atual.cpf,
    );

    this.pacientes[index] = atualizado;
    return { ...atualizado };
  }

  async delete(id: number): Promise<boolean> {
    const index = this.pacientes.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.pacientes.splice(index, 1);
    return true;
  }
}
