import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
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

  async getQRCode(userId: string): Promise<{ qrCode: string; qrImage: string }> {
    const user = await this.findOne(userId);

    try {
      const qrImage = await QRCode.toDataURL(user.qrCode);
      return {
        qrCode: user.qrCode,
        qrImage,
      };
    } catch (error) {
      throw new BadRequestException('Error generando código QR');
    }
  }

  async getAttendanceHistory(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<any> {
    // Esta funcionalidad será implementada en el módulo de Attendance
    // Por ahora retornamos una estructura vacía
    const { page = 1, limit = 20 } = paginationDto;
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  async getUserMembership(userId: string): Promise<any> {
    // Esta funcionalidad será implementada en el módulo de Memberships
    // Por ahora retornamos null
    return null;
  }

  sanitizeUser(user: User): Partial<User> {
    const { password, ...result } = user;
    return result;
  }
}
