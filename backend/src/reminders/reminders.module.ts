import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemindersService } from './reminders.service';
import { Booking } from '../bookings/entities/booking.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    forwardRef(() => NotificationsModule),
  ],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}
