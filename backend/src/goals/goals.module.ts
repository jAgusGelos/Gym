import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { UserGoal } from './entities/user-goal.entity';
import { ProgressEntry } from '../progress-tracking/entities/progress-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGoal, ProgressEntry])],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
