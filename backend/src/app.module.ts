import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembershipsModule } from './memberships/memberships.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ExercisesModule } from './exercises/exercises.module';
import { PaymentsModule } from './payments/payments.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ClassesModule } from './classes/classes.module';
import { BookingsModule } from './bookings/bookings.module';
import { RoutinesModule } from './routines/routines.module';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { ProgressTrackingModule } from './progress-tracking/progress-tracking.module';
import { AchievementsModule } from './achievements/achievements.module';
import { GoalsModule } from './goals/goals.module';
import { WorkoutLogsModule } from './workout-logs/workout-logs.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TrainersModule } from './trainers/trainers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BodyMeasurementsModule } from './body-measurements/body-measurements.module';
import { RemindersModule } from './reminders/reminders.module';
import { WorkoutRoutinesModule } from './workout-routines/workout-routines.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MembershipsModule,
    AttendanceModule,
    ExercisesModule,
    PaymentsModule,
    AnnouncementsModule,
    ClassesModule,
    BookingsModule,
    RoutinesModule,
    MercadopagoModule,
    ProgressTrackingModule,
    AchievementsModule,
    GoalsModule,
    WorkoutLogsModule,
    TrainersModule,
    NotificationsModule,
    BodyMeasurementsModule,
    RemindersModule,
    WorkoutRoutinesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
