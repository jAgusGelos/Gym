import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutRoutineDto } from './create-workout-routine.dto';

export class UpdateWorkoutRoutineDto extends PartialType(
  CreateWorkoutRoutineDto,
) {}
