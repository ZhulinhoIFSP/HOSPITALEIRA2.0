import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePacienteUseCase } from '../../application/use-cases/pacientes/create-paciente.use-case';
import { DeletePacienteUseCase } from '../../application/use-cases/pacientes/delete-paciente.use-case';
import { GetPacienteByIdUseCase } from '../../application/use-cases/pacientes/get-paciente-by-id.use-case';
import { ListPacientesUseCase } from '../../application/use-cases/pacientes/list-pacientes.use-case';
import { UpdatePacienteUseCase } from '../../application/use-cases/pacientes/update-paciente.use-case';
import { CreatePacienteDto } from '../dtos/create-paciente.dto';
import { UpdatePacienteDto } from '../dtos/update-paciente.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(
    private readonly listPacientesUseCase: ListPacientesUseCase,
    private readonly getPacienteByIdUseCase: GetPacienteByIdUseCase,
    private readonly createPacienteUseCase: CreatePacienteUseCase,
    private readonly updatePacienteUseCase: UpdatePacienteUseCase,
    private readonly deletePacienteUseCase: DeletePacienteUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.listPacientesUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getPacienteByIdUseCase.execute(id);
  }

  @Post()
  async create(@Body() dto: CreatePacienteDto) {
    return this.createPacienteUseCase.execute(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePacienteDto,
  ) {
    return this.updatePacienteUseCase.execute(id, dto);
  }

  @Put(':id')
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePacienteDto,
  ) {
    return this.updatePacienteUseCase.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.deletePacienteUseCase.execute(id);
    return { success: deleted, message: `Paciente #${id} excluído com sucesso.` };
  }
}
