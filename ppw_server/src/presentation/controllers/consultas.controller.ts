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
import { CreateConsultaUseCase } from '../../application/use-cases/consultas/create-consulta.use-case';
import { DeleteConsultaUseCase } from '../../application/use-cases/consultas/delete-consulta.use-case';
import { GetConsultaByIdUseCase } from '../../application/use-cases/consultas/get-consulta-by-id.use-case';
import { ListConsultasUseCase } from '../../application/use-cases/consultas/list-consultas.use-case';
import { SyncConsultasUseCase } from '../../application/use-cases/consultas/sync-consultas.use-case';
import { UpdateConsultaUseCase } from '../../application/use-cases/consultas/update-consulta.use-case';
import { Consulta } from '../../domain/entities/consulta.entity';
import { CreateConsultaDto } from '../dtos/create-consulta.dto';
import { UpdateConsultaDto } from '../dtos/update-consulta.dto';

@Controller('consultas')
export class ConsultasController {
  constructor(
    private readonly listConsultasUseCase: ListConsultasUseCase,
    private readonly getConsultaByIdUseCase: GetConsultaByIdUseCase,
    private readonly createConsultaUseCase: CreateConsultaUseCase,
    private readonly updateConsultaUseCase: UpdateConsultaUseCase,
    private readonly deleteConsultaUseCase: DeleteConsultaUseCase,
    private readonly syncConsultasUseCase: SyncConsultasUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.listConsultasUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getConsultaByIdUseCase.execute(id);
  }

  @Post()
  async create(@Body() dto: CreateConsultaDto) {
    return this.createConsultaUseCase.execute(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsultaDto,
  ) {
    return this.updateConsultaUseCase.execute(id, dto);
  }

  @Put(':id')
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsultaDto,
  ) {
    return this.updateConsultaUseCase.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.deleteConsultaUseCase.execute(id);
    return { success: deleted, message: `Consulta #${id} excluída com sucesso.` };
  }

  @Put('sincronizar')
  async sincronizar(@Body() consultas: Consulta[]) {
    return this.syncConsultasUseCase.execute(consultas);
  }
}
