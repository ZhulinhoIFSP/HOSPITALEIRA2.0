import { Module } from '@nestjs/common';
import { CreatePacienteUseCase } from '../application/use-cases/pacientes/create-paciente.use-case';
import { DeletePacienteUseCase } from '../application/use-cases/pacientes/delete-paciente.use-case';
import { GetPacienteByIdUseCase } from '../application/use-cases/pacientes/get-paciente-by-id.use-case';
import { ListPacientesUseCase } from '../application/use-cases/pacientes/list-pacientes.use-case';
import { UpdatePacienteUseCase } from '../application/use-cases/pacientes/update-paciente.use-case';
import { PacientesController } from '../presentation/controllers/pacientes.controller';

@Module({
  controllers: [PacientesController],
  providers: [
    ListPacientesUseCase,
    GetPacienteByIdUseCase,
    CreatePacienteUseCase,
    UpdatePacienteUseCase,
    DeletePacienteUseCase,
  ],
  exports: [
    ListPacientesUseCase,
    GetPacienteByIdUseCase,
    CreatePacienteUseCase,
    UpdatePacienteUseCase,
    DeletePacienteUseCase,
  ],
})
export class PacientesModule {}
