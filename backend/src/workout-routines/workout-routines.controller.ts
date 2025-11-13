import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkoutRoutinesService } from './workout-routines.service';
import { CreateWorkoutRoutineDto } from './dto/create-workout-routine.dto';
import { UpdateWorkoutRoutineDto } from './dto/update-workout-routine.dto';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('workout-routines')
@UseGuards(JwtAuthGuard)
export class WorkoutRoutinesController {
  constructor(private readonly workoutRoutinesService: WorkoutRoutinesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  create(@Request() req, @Body() createWorkoutRoutineDto: CreateWorkoutRoutineDto) {
    return this.workoutRoutinesService.create(req.user.userId, createWorkoutRoutineDto);
  }

  @Get()
  findAll(
    @Query('trainerId') trainerId?: string,
    @Query('clientId') clientId?: string,
    @Query('activa') activa?: string,
  ) {
    const isActive = activa === 'true' ? true : activa === 'false' ? false : undefined;
    return this.workoutRoutinesService.findAll(trainerId, clientId, isActive);
  }

  @Get('my-routines')
  getMyRoutines(@Request() req, @Query('activa') activa?: string) {
    const isActive = activa === 'true' ? true : activa === 'false' ? false : undefined;
    return this.workoutRoutinesService.findAll(undefined, req.user.userId, isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutRoutinesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateWorkoutRoutineDto: UpdateWorkoutRoutineDto,
  ) {
    return this.workoutRoutinesService.update(
      id,
      req.user.userId,
      req.user.role,
      updateWorkoutRoutineDto,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TRAINER, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.workoutRoutinesService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':id/activate')
  activateRoutine(@Param('id') id: string, @Request() req) {
    return this.workoutRoutinesService.activateRoutine(id, req.user.userId);
  }

  // Workout Log endpoints
  @Post('logs')
  logWorkout(@Request() req, @Body() createWorkoutLogDto: CreateWorkoutLogDto) {
    return this.workoutRoutinesService.logWorkout(req.user.userId, createWorkoutLogDto);
  }

  @Get('logs/my-logs')
  getMyWorkoutLogs(
    @Request() req,
    @Query('routineId') routineId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.workoutRoutinesService.getWorkoutLogs(
      req.user.userId,
      routineId,
      startDate,
      endDate,
    );
  }

  @Get('logs/exercise-progress/:exerciseId')
  getExerciseProgress(@Request() req, @Param('exerciseId') exerciseId: string) {
    return this.workoutRoutinesService.getExerciseProgress(req.user.userId, exerciseId);
  }
}
