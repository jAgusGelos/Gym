import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { AttendanceService } from '../attendance/attendance.service';
import { MembershipsService } from '../memberships/memberships.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AttendanceService))
    private attendanceService: AttendanceService,
    @Inject(forwardRef(() => MembershipsService))
    private membershipsService: MembershipsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: UserFiltersDto,
  ): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.rol) {
      where.rol = filters.rol;
    }

    if (filters?.estado) {
      where.estado = filters.estado;
    }

    const [data, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { fechaRegistro: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se actualiza el email, verificar que no exista
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async getQRCode(
    userId: string,
  ): Promise<{ qrCode: string; qrImage: string }> {
    const user = await this.findOne(userId);

    try {
      const qrImage = await QRCode.toDataURL(user.qrCode);
      return {
        qrCode: user.qrCode,
        qrImage,
      };
    } catch {
      throw new BadRequestException('Error generando código QR');
    }
  }

  async getAttendanceHistory(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<any> {
    // Verificar que el usuario existe
    await this.findOne(userId);

    // Obtener el historial de asistencias del usuario
    return await this.attendanceService.findUserAttendance(
      userId,
      paginationDto,
    );
  }

  async getUserMembership(userId: string): Promise<any> {
    // Verificar que el usuario existe
    await this.findOne(userId);

    // Obtener la membresía activa del usuario
    const membership = await this.membershipsService.findActiveByUserId(userId);

    if (!membership) {
      return null;
    }

    // Calcular días restantes
    const daysRemaining = this.membershipsService.getDaysRemaining(membership);

    return {
      ...membership,
      daysRemaining,
    };
  }

  async getStats(): Promise<any> {
    const totalUsers = await this.userRepository.count();

    const activeUsers = await this.userRepository.count({
      where: { estado: UserStatus.ACTIVO },
    });

    const inactiveUsers = await this.userRepository.count({
      where: { estado: UserStatus.INACTIVO },
    });

    const suspendedUsers = await this.userRepository.count({
      where: { estado: UserStatus.SUSPENDIDO },
    });

    // Contar usuarios por rol
    const adminCount = await this.userRepository.count({
      where: { rol: UserRole.ADMIN },
    });

    const trainerCount = await this.userRepository.count({
      where: { rol: UserRole.ENTRENADOR },
    });

    const receptionistCount = await this.userRepository.count({
      where: { rol: UserRole.RECEPCIONISTA },
    });

    const memberCount = await this.userRepository.count({
      where: { rol: UserRole.SOCIO },
    });

    // Obtener nuevos usuarios en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersLastMonth = await this.userRepository
      .createQueryBuilder('user')
      .where('user.fechaRegistro >= :date', { date: thirtyDaysAgo })
      .getCount();

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      usersByRole: {
        admin: adminCount,
        trainer: trainerCount,
        receptionist: receptionistCount,
        member: memberCount,
      },
      newUsersLastMonth,
    };
  }

  sanitizeUser(user: User): Partial<User> {
    const { password: _password, ...result } = user;
    return result;
  }
}
