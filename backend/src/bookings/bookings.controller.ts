import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { parseLocalDate } from '../common/utils/date.utils';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.create(createBookingDto, user.id);
  }

  @Delete(':id')
  async cancel(@Param('id') id: string, @CurrentUser() user: User) {
    await this.bookingsService.cancel(id, user.id);
    return { message: 'Reserva cancelada exitosamente' };
  }

  @Patch(':id/cancel')
  async cancelBooking(@Param('id') id: string, @CurrentUser() user: User) {
    await this.bookingsService.cancel(id, user.id);
    return { message: 'Reserva cancelada exitosamente' };
  }

  @Get('my-bookings')
  async getMyBookings(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
    @Query('includeExpired') includeExpired?: string,
  ) {
    return this.bookingsService.findUserBookings(
      user.id,
      paginationDto,
      includeExpired === 'true',
    );
  }

  @Get('schedule/:scheduleId')
  @Roles(UserRole.ADMIN, UserRole.ENTRENADOR, UserRole.RECEPCIONISTA)
  async getScheduleBookings(
    @Param('scheduleId') scheduleId: string,
    @Query('classDate') classDate: string,
  ) {
    return this.bookingsService.findScheduleBookings(
      scheduleId,
      classDate ? parseLocalDate(classDate) : undefined,
    );
  }

  @Post('check-in')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async checkIn(
    @Body('qrCode') qrCode: string,
    @Body('scheduleId') scheduleId: string,
    @Body('classDate') classDate: string,
  ) {
    return this.bookingsService.checkInWithQR(
      qrCode,
      scheduleId,
      parseLocalDate(classDate),
    );
  }

  @Get('history')
  async getHistory(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.bookingsService.findUserHistory(user.id, paginationDto);
  }

  @Get('stats')
  async getAttendanceStats(@CurrentUser() user: User) {
    return this.bookingsService.getUserAttendanceStats(user.id);
  }

  @Get('monthly-attendance')
  async getMonthlyAttendance(
    @CurrentUser() user: User,
    @Query('months') months?: string,
  ) {
    return this.bookingsService.getUserMonthlyAttendance(
      user.id,
      months ? parseInt(months) : 6,
    );
  }
}
