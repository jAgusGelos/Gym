import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Cron job que se ejecuta cada hora para enviar recordatorios de 24 horas antes
   */
  @Cron(CronExpression.EVERY_HOUR)
  async send24HourReminders() {
    this.logger.log('Ejecutando job de recordatorios de 24 horas...');

    try {
      // Calcular rango de tiempo: entre 23 y 25 horas desde ahora
      const now = new Date();
      const start = new Date(now.getTime() + 23 * 60 * 60 * 1000);
      const end = new Date(now.getTime() + 25 * 60 * 60 * 1000);

      // Buscar reservas que necesitan recordatorio de 24h
      const bookings = await this.bookingRepository.find({
        where: {
          estado: BookingStatus.RESERVADO,
          enListaEspera: false,
          reminder24hSent: false,
        },
        relations: ['class', 'user'],
      });

      // Filtrar por rango de fecha
      const bookingsToRemind = bookings.filter((booking) => {
        const classDate = new Date(booking.class.fechaHoraInicio);
        return classDate >= start && classDate <= end;
      });

      this.logger.log(`Encontradas ${bookingsToRemind.length} reservas para recordatorio de 24h`);

      // Enviar notificaciones
      for (const booking of bookingsToRemind) {
        try {
          const fechaClase = format(
            new Date(booking.class.fechaHoraInicio),
            "dd 'de' MMMM 'a las' HH:mm",
            { locale: es },
          );

          await this.notificationsService.create({
            userId: booking.userId,
            type: 'CLASS_REMINDER',
            priority: 'HIGH',
            title: 'Recordatorio de Clase',
            message: `Recordá que mañana tenés ${booking.class.nombre} el ${fechaClase}. ¡Te esperamos!`,
            actionUrl: '/classes',
            actionLabel: 'Ver Mis Reservas',
          });

          // Marcar recordatorio como enviado
          booking.reminder24hSent = true;
          await this.bookingRepository.save(booking);

          this.logger.log(
            `Recordatorio de 24h enviado para booking ${booking.id} - Usuario: ${booking.userId}`,
          );
        } catch (error) {
          this.logger.error(
            `Error enviando recordatorio de 24h para booking ${booking.id}:`,
            error,
          );
        }
      }

      this.logger.log('Job de recordatorios de 24 horas completado');
    } catch (error) {
      this.logger.error('Error en job de recordatorios de 24 horas:', error);
    }
  }

  /**
   * Cron job que se ejecuta cada 30 minutos para enviar recordatorios de 2 horas antes
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async send2HourReminders() {
    this.logger.log('Ejecutando job de recordatorios de 2 horas...');

    try {
      // Calcular rango de tiempo: entre 1.5 y 2.5 horas desde ahora
      const now = new Date();
      const start = new Date(now.getTime() + 1.5 * 60 * 60 * 1000);
      const end = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);

      // Buscar reservas que necesitan recordatorio de 2h
      const bookings = await this.bookingRepository.find({
        where: {
          estado: BookingStatus.RESERVADO,
          enListaEspera: false,
          reminder2hSent: false,
        },
        relations: ['class', 'user'],
      });

      // Filtrar por rango de fecha
      const bookingsToRemind = bookings.filter((booking) => {
        const classDate = new Date(booking.class.fechaHoraInicio);
        return classDate >= start && classDate <= end;
      });

      this.logger.log(`Encontradas ${bookingsToRemind.length} reservas para recordatorio de 2h`);

      // Enviar notificaciones
      for (const booking of bookingsToRemind) {
        try {
          const fechaClase = format(
            new Date(booking.class.fechaHoraInicio),
            "HH:mm",
            { locale: es },
          );

          await this.notificationsService.create({
            userId: booking.userId,
            type: 'CLASS_REMINDER',
            priority: 'URGENT',
            title: '¡Clase en 2 Horas!',
            message: `Tu clase de ${booking.class.nombre} comienza a las ${fechaClase}. ¡No olvides asistir!`,
            actionUrl: '/qr',
            actionLabel: 'Ver mi QR',
          });

          // Marcar recordatorio como enviado
          booking.reminder2hSent = true;
          await this.bookingRepository.save(booking);

          this.logger.log(
            `Recordatorio de 2h enviado para booking ${booking.id} - Usuario: ${booking.userId}`,
          );
        } catch (error) {
          this.logger.error(
            `Error enviando recordatorio de 2h para booking ${booking.id}:`,
            error,
          );
        }
      }

      this.logger.log('Job de recordatorios de 2 horas completado');
    } catch (error) {
      this.logger.error('Error en job de recordatorios de 2 horas:', error);
    }
  }

  /**
   * Cron job que se ejecuta diariamente para marcar no asistencias
   * Se ejecuta a las 00:00 todos los días
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async markNoShows() {
    this.logger.log('Ejecutando job de marcado de no asistencias...');

    try {
      const now = new Date();

      // Buscar reservas confirmadas de clases que ya pasaron
      const bookings = await this.bookingRepository.find({
        where: {
          estado: BookingStatus.RESERVADO,
          enListaEspera: false,
        },
        relations: ['class'],
      });

      // Filtrar clases que ya pasaron
      const expiredBookings = bookings.filter((booking) => {
        const classEndDate = new Date(booking.class.fechaHoraFin);
        return classEndDate < now;
      });

      this.logger.log(`Encontradas ${expiredBookings.length} reservas para marcar como no asistidas`);

      // Marcar como no asistidas
      for (const booking of expiredBookings) {
        try {
          booking.estado = BookingStatus.NO_ASISTIO;
          await this.bookingRepository.save(booking);

          this.logger.log(`Booking ${booking.id} marcado como NO_ASISTIO`);
        } catch (error) {
          this.logger.error(`Error marcando booking ${booking.id} como no asistido:`, error);
        }
      }

      this.logger.log('Job de marcado de no asistencias completado');
    } catch (error) {
      this.logger.error('Error en job de marcado de no asistencias:', error);
    }
  }
}
