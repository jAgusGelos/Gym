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
import { BodyMeasurementsService } from './body-measurements.service';
import { CreateBodyMeasurementDto } from './dto/create-body-measurement.dto';
import { UpdateBodyMeasurementDto } from './dto/update-body-measurement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('body-measurements')
@UseGuards(JwtAuthGuard)
export class BodyMeasurementsController {
  constructor(private readonly bodyMeasurementsService: BodyMeasurementsService) {}

  @Post()
  create(@Request() req, @Body() createBodyMeasurementDto: CreateBodyMeasurementDto) {
    return this.bodyMeasurementsService.create(req.user.userId, createBodyMeasurementDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.bodyMeasurementsService.findAllByUser(req.user.userId);
  }

  @Get('history')
  findHistory(@Request() req, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.bodyMeasurementsService.findUserHistory(
      req.user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('latest')
  findLatest(@Request() req) {
    return this.bodyMeasurementsService.findLatest(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.bodyMeasurementsService.getEvolutionStats(req.user.userId);
  }

  @Get('progress')
  getProgress(@Request() req, @Query('months') months?: string) {
    return this.bodyMeasurementsService.getWeightProgress(
      req.user.userId,
      months ? parseInt(months) : 6,
    );
  }

  @Get('compare/:id1/:id2')
  compareMeasurements(@Request() req, @Param('id1') id1: string, @Param('id2') id2: string) {
    return this.bodyMeasurementsService.compareMeasurements(req.user.userId, id1, id2);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.bodyMeasurementsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBodyMeasurementDto: UpdateBodyMeasurementDto,
  ) {
    return this.bodyMeasurementsService.update(id, req.user.userId, updateBodyMeasurementDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.bodyMeasurementsService.remove(id, req.user.userId);
  }
}
