import { Module } from '@nestjs/common';
import { CreateMedicoUseCase } from '../application/use-cases/medicos/create-medico.use-case';
import { DeleteMedicoUseCase } from '../application/use-cases/medicos/delete-medico.use-case';
import { GetMedicoByIdUseCase } from '../application/use-cases/medicos/get-medico-by-id.use-case';
import { ListMedicosUseCase } from '../application/use-cases/medicos/list-medicos.use-case';
import { UpdateMedicoUseCase } from '../application/use-cases/medicos/update-medico.use-case';
import { MedicosController } from '../presentation/controllers/medicos.controller';

@Module({
  controllers: [MedicosController],
  providers: [
    ListMedicosUseCase,
    GetMedicoByIdUseCase,
    CreateMedicoUseCase,
    UpdateMedicoUseCase,
    DeleteMedicoUseCase,
  ],
  exports: [
    ListMedicosUseCase,
    GetMedicoByIdUseCase,
    CreateMedicoUseCase,
    UpdateMedicoUseCase,
    DeleteMedicoUseCase,
  ],
})
export class MedicosModule {}
