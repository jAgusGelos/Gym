import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { ClassSchedule } from '../classes/entities/class-schedule.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Routine } from '../routines/entities/routine.entity';
import { WorkoutRoutine } from '../workout-routines/entities/workout-routine.entity';
import { WorkoutLog } from '../workout-routines/entities/workout-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Class,
      ClassSchedule,
      Booking,
      Routine,
      WorkoutRoutine,
      WorkoutLog,
    ]),
  ],
  providers: [TrainersService],
  controllers: [TrainersController],
})
export class TrainersModule {}
