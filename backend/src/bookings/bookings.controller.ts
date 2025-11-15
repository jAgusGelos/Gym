import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.ENTRENADOR, UserRole.RECEPCIONISTA)
  async getClassBookings(@Param('classId') classId: string) {
    return this.bookingsService.findClassBookings(classId);
  }

  @Post(':id/check-in')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async checkIn(@Param('id') classId: string, @Body('qrCode') qrCode: string) {
    return this.bookingsService.checkInWithQR(qrCode, classId);
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
