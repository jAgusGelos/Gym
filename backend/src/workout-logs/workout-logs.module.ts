import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutLogsService } from './workout-logs.service';
import { WorkoutLogsController } from './workout-logs.controller';
import { WorkoutLog } from './entities/workout-log.entity';
import { ExerciseSet } from './entities/exercise-set.entity';
import { AchievementsModule } from '../achievements/achievements.module';
import { ProgressTrackingModule } from '../progress-tracking/progress-tracking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkoutLog, ExerciseSet]),
    AchievementsModule,
    ProgressTrackingModule,
  ],
  controllers: [WorkoutLogsController],
  providers: [WorkoutLogsService],
  exports: [WorkoutLogsService],
})
export class WorkoutLogsModule {}
