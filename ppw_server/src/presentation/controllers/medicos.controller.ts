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
import { CreateMedicoUseCase } from '../../application/use-cases/medicos/create-medico.use-case';
import { DeleteMedicoUseCase } from '../../application/use-cases/medicos/delete-medico.use-case';
import { GetMedicoByIdUseCase } from '../../application/use-cases/medicos/get-medico-by-id.use-case';
import { ListMedicosUseCase } from '../../application/use-cases/medicos/list-medicos.use-case';
import { UpdateMedicoUseCase } from '../../application/use-cases/medicos/update-medico.use-case';
import { CreateMedicoDto } from '../dtos/create-medico.dto';
import { UpdateMedicoDto } from '../dtos/update-medico.dto';

@Controller('medicos')
export class MedicosController {
  constructor(
    private readonly listMedicosUseCase: ListMedicosUseCase,
    private readonly getMedicoByIdUseCase: GetMedicoByIdUseCase,
    private readonly createMedicoUseCase: CreateMedicoUseCase,
    private readonly updateMedicoUseCase: UpdateMedicoUseCase,
    private readonly deleteMedicoUseCase: DeleteMedicoUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.listMedicosUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getMedicoByIdUseCase.execute(id);
  }

  @Post()
  async create(@Body() dto: CreateMedicoDto) {
    return this.createMedicoUseCase.execute(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicoDto,
  ) {
    return this.updateMedicoUseCase.execute(id, dto);
  }

  @Put(':id')
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicoDto,
  ) {
    return this.updateMedicoUseCase.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.deleteMedicoUseCase.execute(id);
    return { success: deleted, message: `Médico #${id} excluído com sucesso.` };
  }
}
