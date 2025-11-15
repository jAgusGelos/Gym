import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, CheckInType } from './entities/attendance.entity';
import { User } from '../users/entities/user.entity';
import { Membership, MembershipStatus } from '../memberships/entities/membership.entity';
import { CheckInDto, ManualCheckInDto, CheckOutDto } from './dto/check-in.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  async checkIn(checkInDto: CheckInDto): Promise<Attendance> {
    const { qrCode } = checkInDto;

    // Buscar usuario por QR code
    const user = await this.userRepository.findOne({
      where: { qrCode },
    });

    if (!user) {
      throw new NotFoundException('Código QR inválido');
    }

    // Verificar que el usuario esté activo
    if (user.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario inactivo o suspendido');
    }

    // Verificar que tenga membresía activa
    await this.verifyActiveMembership(user.id);

    // Verificar que no haya hecho check-in hoy
    await this.verifyNoCheckInToday(user.id);

    // Crear registro de asistencia
    const attendance = this.attendanceRepository.create({
      userId: user.id,
      fecha: new Date(),
      horaEntrada: new Date(),
      tipoCheckIn: CheckInType.QR,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);

    // Cargar la relación user para devolverla
    return await this.attendanceRepository.findOne({
      where: { id: savedAttendance.id },
      relations: ['user'],
    });
  }

  async manualCheckIn(manualCheckInDto: ManualCheckInDto): Promise<Attendance> {
    const { userId } = manualCheckInDto;

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el usuario esté activo
    if (user.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario inactivo o suspendido');
    }

    // Verificar que tenga membresía activa
    await this.verifyActiveMembership(userId);

    // Verificar que no haya hecho check-in hoy
    await this.verifyNoCheckInToday(userId);

    // Crear registro de asistencia
    const attendance = this.attendanceRepository.create({
      userId,
      fecha: new Date(),
      horaEntrada: new Date(),
      tipoCheckIn: CheckInType.MANUAL,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);

    return await this.attendanceRepository.findOne({
      where: { id: savedAttendance.id },
      relations: ['user'],
    });
  }

  async checkOut(checkOutDto: CheckOutDto): Promise<Attendance> {
    const { attendanceId } = checkOutDto;

    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException('Registro de asistencia no encontrado');
    }

    if (attendance.horaSalida) {
      throw new BadRequestException('Ya se registró la salida');
    }

    attendance.horaSalida = new Date();
    return await this.attendanceRepository.save(attendance);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: { fecha?: string; userId?: string },
  ): Promise<PaginatedResult<Attendance>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.user', 'user')
      .skip(skip)
      .take(limit)
      .orderBy('attendance.horaEntrada', 'DESC');

    if (filters?.fecha) {
      const date = new Date(filters.fecha);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      queryBuilder.andWhere('attendance.fecha >= :start AND attendance.fecha < :end', {
        start: date,
        end: nextDay,
      });
    }

    if (filters?.userId) {
      queryBuilder.andWhere('attendance.userId = :userId', {
        userId: filters.userId,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUserAttendance(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Attendance>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.attendanceRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { fecha: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTodayAttendance(): Promise<Attendance[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.attendanceRepository.find({
      where: {
        fecha: Between(today, tomorrow),
      },
      relations: ['user'],
      order: { horaEntrada: 'DESC' },
    });
  }

  async getStats(startDate?: string, endDate?: string): Promise<any> {
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    if (!startDate) {
      start.setDate(start.getDate() - 30);
    }

    const attendances = await this.attendanceRepository.find({
      where: {
        fecha: Between(start, end),
      },
    });

    const totalAsistencias = attendances.length;
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const promedioAsistenciasDiarias = Math.round(totalAsistencias / days);

    // Agrupar por fecha
    const attendanceByDate = attendances.reduce((acc, att) => {
      const dateKey = att.fecha.toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    const diaConMasAsistencia = Object.entries(attendanceByDate).sort(
      ([, a], [, b]) => (b as number) - (a as number),
    )[0];

    // Agrupar por hora
    const attendanceByHour = attendances.reduce((acc, att) => {
      const hour = new Date(att.horaEntrada).getHours();
      const hourKey = `${hour}:00`;
      acc[hourKey] = (acc[hourKey] || 0) + 1;
      return acc;
    }, {});

    const horasPico = Object.entries(attendanceByHour)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([hora, cantidad]) => ({ hora, cantidad }));

    return {
      totalAsistencias,
      promedioAsistenciasDiarias,
      diaConMasAsistencia: diaConMasAsistencia
        ? {
            fecha: diaConMasAsistencia[0],
            cantidad: diaConMasAsistencia[1],
          }
        : null,
      horasPico,
    };
  }

  private async verifyActiveMembership(userId: string): Promise<void> {
    const membership = await this.membershipRepository.findOne({
      where: {
        userId,
        estado: MembershipStatus.ACTIVA,
      },
      order: { fechaVencimiento: 'DESC' },
    });

    if (!membership) {
      throw new UnauthorizedException(
        'No tiene una membresía activa. Por favor, contacte con recepción.',
      );
    }

    // Verificar que no esté vencida
    if (new Date(membership.fechaVencimiento) < new Date()) {
      throw new UnauthorizedException(
        'Su membresía ha vencido. Por favor, renueve su membresía en recepción.',
      );
    }
  }

  private async verifyNoCheckInToday(userId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingCheckIn = await this.attendanceRepository.findOne({
      where: {
        userId,
        fecha: Between(today, tomorrow),
      },
    });

    if (existingCheckIn) {
      throw new BadRequestException('Ya registró su ingreso hoy');
    }
  }
}
