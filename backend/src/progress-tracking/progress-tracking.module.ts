import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressTrackingService } from './progress-tracking.service';
import { ProgressTrackingController } from './progress-tracking.controller';
import { ProgressEntry } from './entities/progress-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgressEntry])],
  controllers: [ProgressTrackingController],
  providers: [ProgressTrackingService],
  exports: [ProgressTrackingService],
})
export class ProgressTrackingModule {}
