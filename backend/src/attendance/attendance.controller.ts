import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckInDto, ManualCheckInDto, CheckOutDto } from './dto/check-in.dto';
import { AttendanceFiltersDto } from './dto/attendance-filters.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @Public()
  async checkIn(@Body() checkInDto: CheckInDto) {
    return this.attendanceService.checkIn(checkInDto);
  }

  @Post('manual-check-in')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async manualCheckIn(@Body() manualCheckInDto: ManualCheckInDto) {
    return this.attendanceService.manualCheckIn(manualCheckInDto);
  }

  @Post('check-out')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async checkOut(@Body() checkOutDto: CheckOutDto) {
    return this.attendanceService.checkOut(checkOutDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async findAll(@Query() filters: AttendanceFiltersDto) {
    const { page, limit, offset, fecha, userId } = filters;
    return this.attendanceService.findAll(
      { page, limit, offset },
      { fecha, userId },
    );
  }

  @Get('today')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async getTodayAttendance() {
    return this.attendanceService.getTodayAttendance();
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getStats(startDate, endDate);
  }
}
