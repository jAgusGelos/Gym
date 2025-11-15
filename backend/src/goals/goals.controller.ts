import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // Crear un nuevo objetivo
  @Post()
  create(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(req.user.userId, createGoalDto);
  }

  // Obtener todos los objetivos del usuario
  @Get()
  findAll(@Request() req) {
    return this.goalsService.findAllByUser(req.user.userId);
  }

  // Obtener solo objetivos activos
  @Get('active')
  findActive(@Request() req) {
    return this.goalsService.findActiveByUser(req.user.userId);
  }

  // Recalcular progreso de todos los objetivos activos
  @Post('recalculate')
  async recalculate(@Request() req) {
    await this.goalsService.recalculateUserProgress(req.user.userId);
    return { message: 'Progreso recalculado exitosamente' };
  }

  // Obtener un objetivo específico
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.goalsService.findOne(id, req.user.userId);
  }

  // Actualizar un objetivo
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(id, req.user.userId, updateGoalDto);
  }

  // Eliminar un objetivo
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.goalsService.remove(id, req.user.userId);
  }
}
