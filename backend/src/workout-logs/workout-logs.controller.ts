import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { WorkoutLogsService } from './workout-logs.service';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('workout-logs')
@UseGuards(JwtAuthGuard)
export class WorkoutLogsController {
  constructor(private readonly workoutLogsService: WorkoutLogsService) {}

  // Crear un nuevo workout log
  @Post()
  create(@Request() req, @Body() createWorkoutLogDto: CreateWorkoutLogDto) {
    return this.workoutLogsService.create(req.user.userId, createWorkoutLogDto);
  }

  // Obtener todos los workout logs del usuario
  @Get()
  findAll(@Request() req) {
    return this.workoutLogsService.findAllByUser(req.user.userId);
  }

  // Obtener workout logs por rango de fechas
  @Get('date-range')
  findByDateRange(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.workoutLogsService.findByDateRange(
      req.user.userId,
      startDate,
      endDate,
    );
  }

  // Obtener historial de un ejercicio
  @Get('exercise/:exerciseId/history')
  getExerciseHistory(@Request() req, @Param('exerciseId') exerciseId: string) {
    return this.workoutLogsService.getExerciseHistory(
      req.user.userId,
      exerciseId,
    );
  }

  // Obtener estadísticas de un ejercicio
  @Get('exercise/:exerciseId/stats')
  getExerciseStats(@Request() req, @Param('exerciseId') exerciseId: string) {
    return this.workoutLogsService.getExerciseStats(
      req.user.userId,
      exerciseId,
    );
  }

  // Obtener gráfico de evolución de un ejercicio
  @Get('exercise/:exerciseId/chart')
  getExerciseChart(
    @Request() req,
    @Param('exerciseId') exerciseId: string,
    @Query('limit') limit?: string,
  ) {
    return this.workoutLogsService.getExerciseChart(
      req.user.userId,
      exerciseId,
      limit ? parseInt(limit) : 10,
    );
  }

  // Obtener todos los PRs del usuario
  @Get('prs')
  getAllPRs(@Request() req) {
    return this.workoutLogsService.getAllPRs(req.user.userId);
  }

  // Obtener estadísticas generales del usuario
  @Get('stats')
  getUserStats(@Request() req) {
    return this.workoutLogsService.getUserStats(req.user.userId);
  }

  // Obtener un workout log específico
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.workoutLogsService.findOne(id, req.user.userId);
  }

  // Actualizar un workout log
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWorkoutLogDto: UpdateWorkoutLogDto,
  ) {
    return this.workoutLogsService.update(
      id,
      req.user.userId,
      updateWorkoutLogDto,
    );
  }

  // Eliminar un workout log
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.workoutLogsService.remove(id, req.user.userId);
  }
}
