import { Test } from '@nestjs/testing';
import { AppModule } from './app/app.module';
import { ListPacientesUseCase } from './application/use-cases/pacientes/list-pacientes.use-case';
import { CreatePacienteUseCase } from './application/use-cases/pacientes/create-paciente.use-case';
import { UpdatePacienteUseCase } from './application/use-cases/pacientes/update-paciente.use-case';
import { DeletePacienteUseCase } from './application/use-cases/pacientes/delete-paciente.use-case';
import { ListMedicosUseCase } from './application/use-cases/medicos/list-medicos.use-case';
import { CreateMedicoUseCase } from './application/use-cases/medicos/create-medico.use-case';
import { UpdateMedicoUseCase } from './application/use-cases/medicos/update-medico.use-case';
import { DeleteMedicoUseCase } from './application/use-cases/medicos/delete-medico.use-case';
import { ListConsultasUseCase } from './application/use-cases/consultas/list-consultas.use-case';
import { CreateConsultaUseCase } from './application/use-cases/consultas/create-consulta.use-case';
import { UpdateConsultaUseCase } from './application/use-cases/consultas/update-consulta.use-case';
import { DeleteConsultaUseCase } from './application/use-cases/consultas/delete-consulta.use-case';

describe('Clean Architecture Use Cases (CRUD)', () => {
  let listPacientes: ListPacientesUseCase;
  let createPaciente: CreatePacienteUseCase;
  let updatePaciente: UpdatePacienteUseCase;
  let deletePaciente: DeletePacienteUseCase;

  let listMedicos: ListMedicosUseCase;
  let createMedico: CreateMedicoUseCase;
  let updateMedico: UpdateMedicoUseCase;
  let deleteMedico: DeleteMedicoUseCase;

  let listConsultas: ListConsultasUseCase;
  let createConsulta: CreateConsultaUseCase;
  let updateConsulta: UpdateConsultaUseCase;
  let deleteConsulta: DeleteConsultaUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    listPacientes = module.get(ListPacientesUseCase);
    createPaciente = module.get(CreatePacienteUseCase);
    updatePaciente = module.get(UpdatePacienteUseCase);
    deletePaciente = module.get(DeletePacienteUseCase);

    listMedicos = module.get(ListMedicosUseCase);
    createMedico = module.get(CreateMedicoUseCase);
    updateMedico = module.get(UpdateMedicoUseCase);
    deleteMedico = module.get(DeleteMedicoUseCase);

    listConsultas = module.get(ListConsultasUseCase);
    createConsulta = module.get(CreateConsultaUseCase);
    updateConsulta = module.get(UpdateConsultaUseCase);
    deleteConsulta = module.get(DeleteConsultaUseCase);
  });

  describe('Pacientes CRUD', () => {
    it('deve listar pacientes', async () => {
      const pacientes = await listPacientes.execute();
      expect(pacientes.length).toBeGreaterThan(0);
    });

    it('deve criar, atualizar e excluir paciente', async () => {
      const novo = await createPaciente.execute({
        nome: 'Carlos Drummond',
        email: 'carlos@teste.com',
      });
      expect(novo.id).toBeDefined();
      expect(novo.nome).toBe('Carlos Drummond');

      const atualizado = await updatePaciente.execute(novo.id, {
        nome: 'Carlos Drummond de Andrade',
      });
      expect(atualizado.nome).toBe('Carlos Drummond de Andrade');

      const excluido = await deletePaciente.execute(novo.id);
      expect(excluido).toBe(true);
    });
  });

  describe('Medicos CRUD', () => {
    it('deve listar médicos', async () => {
      const medicos = await listMedicos.execute();
      expect(medicos.length).toBeGreaterThan(0);
    });

    it('deve criar, atualizar e excluir médico', async () => {
      const novo = await createMedico.execute({
        nome: 'Dra. Roberta Freitas',
        especialidade: 'Ortopedia',
      });
      expect(novo.id).toBeDefined();
      expect(novo.especialidade).toBe('Ortopedia');

      const atualizado = await updateMedico.execute(novo.id, {
        especialidade: 'Ortopedia e Traumatologia',
      });
      expect(atualizado.especialidade).toBe('Ortopedia e Traumatologia');

      const excluido = await deleteMedico.execute(novo.id);
      expect(excluido).toBe(true);
    });
  });

  describe('Consultas CRUD', () => {
    it('deve listar consultas', async () => {
      const consultas = await listConsultas.execute();
      expect(consultas.length).toBeGreaterThan(0);
    });

    it('deve criar uma nova consulta agendada', async () => {
      const consulta = await createConsulta.execute({
        pacienteId: 1,
        medicoId: 4,
        data: '2026-10-01',
        horario: '09:00',
      });
      expect(consulta.status).toBe('AGENDADA');
    });

    it('deve rejeitar horário ocupado para o mesmo médico', async () => {
      await expect(
        createConsulta.execute({
          pacienteId: 3,
          medicoId: 1,
          data: '2026-09-20',
          horario: '08:00',
        }),
      ).rejects.toThrow('O médico já possui uma consulta agendada para esse horário.');
    });

    it('deve permitir transição válida de status', async () => {
      const atualizada = await updateConsulta.execute(1, {
        status: 'CONFIRMADA',
      });
      expect(atualizada.status).toBe('CONFIRMADA');
    });

    it('deve rejeitar transição inválida de status', async () => {
      await expect(
        updateConsulta.execute(4, {
          status: 'CANCELADA',
        }),
      ).rejects.toThrow('Transição inválida');
    });

    it('deve excluir uma consulta', async () => {
      const consulta = await createConsulta.execute({
        pacienteId: 2,
        medicoId: 3,
        data: '2026-11-15',
        horario: '16:00',
      });
      const removida = await deleteConsulta.execute(consulta.id);
      expect(removida).toBe(true);
    });
  });
});
