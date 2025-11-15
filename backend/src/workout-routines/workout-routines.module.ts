import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutRoutinesService } from './workout-routines.service';
import { WorkoutRoutinesController } from './workout-routines.controller';
import { WorkoutRoutine } from './entities/workout-routine.entity';
import { RoutineExercise } from './entities/routine-exercise.entity';
import { WorkoutLog } from './entities/workout-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutRoutine, RoutineExercise, WorkoutLog])],
  controllers: [WorkoutRoutinesController],
  providers: [WorkoutRoutinesService],
  exports: [WorkoutRoutinesService],
})
export class WorkoutRoutinesModule {}
