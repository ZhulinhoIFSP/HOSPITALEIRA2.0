import { Global, Module } from '@nestjs/common';
import { PACIENTE_REPOSITORY } from '../../domain/repositories/paciente.repository.interface';
import { MEDICO_REPOSITORY } from '../../domain/repositories/medico.repository.interface';
import { CONSULTA_REPOSITORY } from '../../domain/repositories/consulta.repository.interface';
import { InMemoryPacienteRepository } from './in-memory-paciente.repository';
import { InMemoryMedicoRepository } from './in-memory-medico.repository';
import { InMemoryConsultaRepository } from './in-memory-consulta.repository';

@Global()
@Module({
  providers: [
    {
      provide: PACIENTE_REPOSITORY,
      useClass: InMemoryPacienteRepository,
    },
    {
      provide: MEDICO_REPOSITORY,
      useClass: InMemoryMedicoRepository,
    },
    {
      provide: CONSULTA_REPOSITORY,
      useClass: InMemoryConsultaRepository,
    },
  ],
  exports: [PACIENTE_REPOSITORY, MEDICO_REPOSITORY, CONSULTA_REPOSITORY],
})
export class RepositoriesModule {}
