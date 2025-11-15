import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProgressTrackingService } from './progress-tracking.service';
import { CreateProgressEntryDto } from './dto/create-progress-entry.dto';
import { UpdateProgressEntryDto } from './dto/update-progress-entry.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressTrackingController {
  constructor(
    private readonly progressTrackingService: ProgressTrackingService,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createProgressEntryDto: CreateProgressEntryDto,
  ) {
    return this.progressTrackingService.create(user.id, createProgressEntryDto);
  }

  @Get('my-progress')
  async getMyProgress(@CurrentUser() user: User) {
    return this.progressTrackingService.findAllByUser(user.id);
  }

  @Get('stats')
  async getStats(@CurrentUser() user: User) {
    return this.progressTrackingService.getStats(user.id);
  }

  @Get('date-range')
  async getByDateRange(
    @CurrentUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.progressTrackingService.findByDateRange(
      user.id,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.progressTrackingService.findOne(id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateProgressEntryDto: UpdateProgressEntryDto,
  ) {
    return this.progressTrackingService.update(
      id,
      user.id,
      updateProgressEntryDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.progressTrackingService.remove(id, user.id);
    return { message: 'Registro eliminado exitosamente' };
  }
}
